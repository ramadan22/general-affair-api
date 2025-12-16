// src/app.ts
import express2 from "express";
import cors from "cors";

// src/modules/user/route.ts
import { Router } from "express";

// src/utils/index.ts
function getBearerToken(req) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
}
function removeObjectKeys(obj, keysToRemove) {
  const result = { ...obj };
  for (const key of keysToRemove) {
    delete result[key];
  }
  return result;
}

// src/config/database.ts
import { PrismaClient } from "@prisma/client";
var globalForPrisma = global;
var prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["warn", "error"]
});
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// src/modules/user/repository.ts
var userRepository = {
  get: (skip, size, where) => {
    return prisma.user.findMany({
      skip,
      take: size,
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        socialMedia: true,
        role: true,
        isActive: true,
        updatedAt: true,
        createdAt: true
      }
    });
  },
  delete: (id2) => {
    return prisma.user.update({
      where: { id: id2 },
      data: { updatedAt: /* @__PURE__ */ new Date(), isDeleted: true }
    });
  },
  count: (where) => {
    return prisma.user.count({ where });
  },
  create: (data) => {
    return prisma.user.create({
      data,
      select: {
        id: true,
        firstName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },
  update: (id2, data) => {
    return prisma.user.update({
      data,
      where: { id: id2 },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        socialMedia: true,
        role: true,
        updatedAt: true
      }
    });
  },
  findByEmail: (email) => {
    return prisma.user.findUnique({ where: { email, isDeleted: false } });
  },
  findById: (id2) => {
    return prisma.user.findUnique({
      where: { id: id2, isDeleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        isActive: true,
        socialMedia: true,
        role: true,
        teamLead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        },
        updatedAt: true,
        createdAt: true
      }
    });
  }
};

// src/utils/appError.ts
var AppError = class extends Error {
  status;
  isOperational;
  data;
  constructor({
    message,
    status = 500,
    isOperational = true,
    data
  }) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.isOperational = isOperational;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
};

// src/modules/user/service.ts
import bcrypt from "bcrypt";
function generateNumericPassword() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
var userService = {
  getUsers: async (page, size, search) => {
    const skip = (page - 1) * size;
    const where = search ? {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } }
      ]
    } : {};
    const [users, total] = await Promise.all([
      userRepository.get(skip, size, { ...where, isDeleted: false }),
      userRepository.count(where)
    ]);
    return {
      data: users,
      meta: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size)
      }
    };
  },
  deleteUser: async (id2) => {
    const user = await userRepository.delete(id2);
    return user;
  },
  register: async (firstName, email, role) => {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError({ message: "Email already registered", status: 400, data: { email } });
    }
    const plainPassword = generateNumericPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = await userRepository.create({
      firstName,
      email,
      password: hashedPassword,
      role
    });
    return { ...user, plainPassword };
  },
  update: async (params) => {
    const userById = await userRepository.findById(params.id);
    if (!userById) {
      throw new AppError({ message: "User not exist", status: 400, data: { userId: params.id } });
    }
    const user = await userRepository.update(params.id, removeObjectKeys({
      ...params,
      updatedAt: /* @__PURE__ */ new Date()
    }, ["id"]));
    return user;
  },
  getById: async (id2) => {
    const user = await userRepository.findById(id2);
    if (!user) {
      throw new AppError({
        message: "User profile not found!",
        status: 404,
        data: null
      });
    }
    return user;
  }
};

// src/utils/response/index.ts
var defaultResponse = ({
  response,
  status,
  message = "",
  data = null,
  meta = null,
  traceId = "",
  success
}) => {
  const payload = {
    success,
    status,
    message,
    data
  };
  if (traceId) payload["traceId"] = traceId;
  if (meta !== null) payload["meta"] = meta;
  response.status(status).json(payload);
};

// src/constants/Role.ts
var Role = /* @__PURE__ */ ((Role3) => {
  Role3["STAFF"] = "STAFF";
  Role3["GA"] = "GA";
  Role3["COORDINATOR"] = "COORDINATOR";
  Role3["LEAD"] = "LEAD";
  Role3["MANAGER"] = "MANAGER";
  return Role3;
})(Role || {});

// src/modules/user/validator.ts
import { z } from "zod";
var registerUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.email({ message: "Invalid email format" }),
  role: z.enum(Object.values(Role))
});
var updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  image: z.url("Image is required and use valid url"),
  socialMedia: z.array(
    z.object({
      name: z.enum([
        "FACEBOOK",
        "INSTAGRAM",
        "TWITTER",
        "LINKEDIN"
      ]),
      url: z.string().url("Invalid URL")
    })
  ).optional().default([]),
  role: z.enum(Object.values(Role))
});

// src/utils/flattenZod.ts
import { z as z2 } from "zod";
function flattenZodErrors(error) {
  const tree = z2.treeifyError(error);
  const result = {};
  function traverse(node, path5 = []) {
    if (node.errors && node.errors.length > 0) {
      const key = path5.join(".");
      result[key] = (result[key] || []).concat(node.errors);
    }
    if (node.properties) {
      for (const [childKey, childNode] of Object.entries(node.properties)) {
        traverse(childNode, [...path5, childKey]);
      }
    }
    if (node.items) {
      node.items.forEach((item, idx) => {
        traverse(item, [...path5, String(idx)]);
      });
    }
  }
  traverse(tree);
  return result;
}

// src/modules/user/controller.ts
async function getUsers(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;
    const keyword = req.query.keyword || "";
    const users = await userService.getUsers(page, size, keyword);
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Get users successfully",
      data: users.data,
      meta: users.meta
    });
  } catch (err) {
    next(err);
  }
}
async function deleteUser(req, res, next) {
  try {
    const id2 = req.params.id;
    await userService.deleteUser(id2);
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Delete user successfully",
      data: null
    });
  } catch (err) {
    next(err);
  }
}
async function updateUser(req, res, next) {
  try {
    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const { id: id2 } = req.params;
    const user = await userService.update({ ...req.body, id: id2 });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "User updated successfully",
      data: user
    });
  } catch (err) {
    next(err);
  }
}
async function register(req, res, next) {
  try {
    const validation = registerUserSchema.safeParse(req.body);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const { firstName, email, role } = req.body;
    const user = await userService.register(firstName, email, role);
    return defaultResponse({
      response: res,
      success: true,
      status: 201,
      message: "User registered successfully",
      data: user
    });
  } catch (err) {
    next(err);
  }
}
async function updateProfile(req, res, next) {
  try {
    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const { id: id2 } = req.user;
    const user = await userService.update({ ...req.body, id: id2 });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Update profile successfully",
      data: user
    });
  } catch (err) {
    next(err);
  }
}
async function getProfile(req, res, next) {
  try {
    const { id: id2 } = req.user;
    const user = await userService.getById(id2);
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Get profile successfully",
      data: user
    });
  } catch (err) {
    next(err);
  }
}

// src/middlewares/checkToken.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET;
var checkUserToken = async (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      throw new AppError({
        message: "Unauthorized: No token provided",
        status: 401
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new AppError({
        message: "Invalid or expired token",
        status: 440
      });
    }
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    next(err);
  }
};

// src/modules/user/route.ts
var router = Router();
router.get("/", checkUserToken, getUsers);
router.delete("/:id", checkUserToken, deleteUser);
router.put("/:id", checkUserToken, updateUser);
router.post("/register", register);
router.put("/update-profile", checkUserToken, updateProfile);
router.get("/profile", checkUserToken, getProfile);
var route_default = router;

// src/modules/authentication/route.ts
import { Router as Router2 } from "express";

// src/modules/authentication/repository.ts
var authenticationRepository = {
  findByEmail: (email) => {
    return prisma.user.findUnique({
      where: { email, isDeleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        socialMedia: true,
        role: true,
        isActive: true,
        password: true,
        updatedAt: true,
        createdAt: true
      }
    });
  },
  findById: (id2) => {
    return prisma.user.findUnique({
      where: { id: id2, isDeleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        socialMedia: true,
        role: true,
        isActive: true,
        password: true,
        updatedAt: true,
        createdAt: true
      }
    });
  },
  update: ({ id: id2, hashedPassword }) => {
    return prisma.user.update({
      where: { id: id2 },
      select: { isActive: true },
      data: {
        password: hashedPassword,
        isActive: true
      }
    });
  }
};

// src/modules/authentication/service.ts
import bcrypt2 from "bcrypt";
var authenticationService = {
  findUserByEmail: async (email) => {
    const user = await authenticationRepository.findByEmail(email);
    if (!user) {
      throw new AppError({
        message: "User not found",
        status: 404
      });
    }
    return user;
  },
  findUserById: async (id2) => {
    const user = await authenticationRepository.findById(id2);
    if (!user) {
      throw new AppError({
        message: "User not found",
        status: 404
      });
    }
    return user;
  },
  findUser: async ({ email, password }) => {
    const user = await authenticationRepository.findByEmail(email);
    const validPassword = await bcrypt2.compare(password, user?.password || "");
    if (!user || !validPassword) {
      throw new AppError({
        message: "Email and password are incorrect!",
        status: 401,
        data: { email }
      });
    }
    return user;
  },
  updateNewPassword: async ({
    id: id2,
    oldPassword,
    newPassword,
    userPassword,
    isActive
  }) => {
    if (isActive) {
      const isMatch = await bcrypt2.compare(oldPassword, userPassword);
      if (!isMatch) {
        throw new AppError({
          message: "Old password is incorrect",
          status: 400
        });
      }
    }
    const hashedPassword = await bcrypt2.hash(newPassword, 10);
    const result = await authenticationRepository.update({ id: id2, hashedPassword });
    return result;
  }
};

// src/modules/authentication/validator.ts
import { z as z3 } from "zod";
var loginAuthenticationSchema = z3.object({
  email: z3.email({ message: "Invalid email format" }),
  password: z3.string().min(6, "Password must be at least 6 characters").nonempty("Password is required")
});
var changePasswordSchema = z3.object({
  newPassword: z3.string().min(6, "New password must be at least 6 characters").nonempty("New password is required"),
  confirmPassword: z3.string().min(6, "Confirm password must be at least 6 characters").nonempty("Confirm password is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirm password do not match",
  path: ["confirmPassword"]
});
var secondChangePasswordSchema = z3.object({
  isActive: z3.boolean(),
  oldPassword: z3.string().optional(),
  newPassword: z3.string().optional(),
  confirmPassword: z3.string().optional()
}).refine(
  (data) => !data.isActive || data.oldPassword !== void 0 && data.oldPassword !== "",
  {
    message: "Old password is required",
    path: ["oldPassword"]
  }
).refine(
  (data) => !data.isActive || data.newPassword !== void 0 && data.newPassword !== "",
  {
    message: "New password is required",
    path: ["newPassword"]
  }
).refine(
  (data) => !data.isActive || data.confirmPassword !== void 0 && data.confirmPassword !== "",
  {
    message: "Confirm password is required",
    path: ["confirmPassword"]
  }
).refine(
  (data) => !data.isActive || !!data.oldPassword && data.oldPassword.length >= 6,
  {
    message: "Old password must be at least 6 characters",
    path: ["oldPassword"]
  }
).refine(
  (data) => !data.isActive || !!data.newPassword && data.newPassword.length >= 6,
  {
    message: "New password must be at least 6 characters",
    path: ["newPassword"]
  }
).refine(
  (data) => !data.isActive || !!data.confirmPassword && data.confirmPassword.length >= 6,
  {
    message: "Confirm password must be at least 6 characters",
    path: ["confirmPassword"]
  }
).refine(
  (data) => !data.isActive || !!data.newPassword && !!data.confirmPassword && data.newPassword === data.confirmPassword,
  {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"]
  }
);

// src/modules/authentication/controller.ts
import jwt2 from "jsonwebtoken";
var JWT_SECRET2 = process.env.JWT_SECRET || "";
var JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || "";
async function login(req, res, next) {
  try {
    const validation = loginAuthenticationSchema.safeParse(req.body);
    if (!validation.success) {
      throw new AppError({
        message: "Validation error",
        status: 400,
        data: flattenZodErrors(validation.error)
      });
    }
    const { email, password } = req.body;
    const user = await authenticationService.findUser({ email, password });
    const data = {
      id: user?.id,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      image: user?.image,
      role: user?.role,
      socialMedia: user?.socialMedia,
      isActive: user?.isActive
    };
    const token = jwt2.sign(
      data,
      JWT_SECRET2,
      { expiresIn: "1h" }
    );
    const refresh = jwt2.sign(
      data,
      JWT_SECRET_REFRESH,
      { expiresIn: "1d" }
    );
    res.addLogMeta({
      step: "login success",
      email: user?.email,
      user: user?.firstName,
      role: user?.role
    });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Login successfully",
      data: { accessToken: token, refreshToken: refresh }
    });
  } catch (err) {
    next(err);
  }
}
async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const validation = changePasswordSchema.safeParse({ newPassword, confirmPassword });
    const { email } = req.user;
    const user = await authenticationService.findUserByEmail(email);
    const isActive = user?.isActive;
    const secondValidation = secondChangePasswordSchema.safeParse({
      oldPassword,
      newPassword,
      confirmPassword,
      isActive
    });
    if (!validation.success || !secondValidation.success) {
      throw new AppError({
        message: "Validation error",
        status: 400,
        data: flattenZodErrors(validation.error || secondValidation.error)
      });
    }
    const result = await authenticationService.updateNewPassword({
      id: user?.id,
      userPassword: user?.password,
      oldPassword,
      newPassword,
      isActive
    });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Password changed successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}
async function refreshToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken2 = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!refreshToken2) {
      throw new AppError({
        message: "Refresh token is missing",
        status: 401
      });
    }
    let decoded;
    try {
      decoded = jwt2.verify(refreshToken2, JWT_SECRET_REFRESH);
    } catch {
      throw new AppError({
        message: "Invalid or expired refresh token",
        status: 440
      });
    }
    const user = await authenticationService.findUserById(decoded.id);
    if (!user) {
      throw new AppError({
        message: "User not found",
        status: 404
      });
    }
    const data = {
      id: user?.id,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      image: user?.image,
      role: user?.role,
      socialMedia: user?.socialMedia,
      isActive: user?.isActive
    };
    const newAccessToken = jwt2.sign(data, JWT_SECRET2, { expiresIn: "1h" });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Token refreshed successfully",
      data: { accessToken: newAccessToken }
    });
  } catch (err) {
    next(err);
  }
}

// src/modules/authentication/route.ts
var router2 = Router2();
router2.post("/login", login);
router2.post("/change-password", checkUserToken, changePassword);
router2.post("/refresh-token", refreshToken);
var route_default2 = router2;

// src/modules/upload/routes.ts
import { Router as Router3 } from "express";

// src/middlewares/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";
var MAX_SIZE_MB = 5;
var storage = multer.diskStorage({
  destination: (req, _, cb) => {
    const type = req.body.type || req.query.type;
    const usage = req.body.usage || req.query.usage;
    if (!type || !usage) {
      return cb(
        new AppError({
          message: "Missing required params: type and usage",
          status: 400
        }),
        void 0
      );
    }
    const allowedTypes = {
      image: "images",
      file: "files"
    };
    const baseFolder = allowedTypes[type];
    if (!baseFolder) {
      return cb(
        new AppError({
          message: "Invalid type. Allowed: image, file",
          status: 400
        }),
        void 0
      );
    }
    const folder = path.join("uploads", baseFolder, usage);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
var uploadDynamic = multer({
  storage,
  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const type = req.body.type || req.query.type;
    if (type === "image" && !file.mimetype.startsWith("image/")) {
      return cb(
        new AppError({
          message: "Only image files are allowed",
          status: 400
        })
      );
    }
    if (type === "file" && file.mimetype.startsWith("image/")) {
      return cb(
        new AppError({
          message: "Images are not allowed for type=file",
          status: 400
        })
      );
    }
    if (!["image", "file"].includes(type)) {
      return cb(
        new AppError({
          message: "Invalid type parameter",
          status: 400
        })
      );
    }
    cb(null, true);
  }
});

// src/middlewares/validateSignature.ts
import sharp from "sharp";
import fs2 from "fs";
var validateSignature = async (req, res, next) => {
  try {
    const usage = req.body.usage || req.query.usage;
    if (usage !== "signatures") return next();
    if (!req.file) {
      return next(new AppError({ message: "Signature file is required", status: 400 }));
    }
    const filePath = req.file.path;
    const image = sharp(filePath);
    const meta = await image.metadata();
    if (meta.width < 150 || meta.height < 40) {
      fs2.unlinkSync(filePath);
      return next(new AppError({ message: "Signature image is too small.", status: 400 }));
    }
    const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const totalPixels = info.width * info.height;
    const transparentCount = [];
    const whiteCount = [];
    const inkCount = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a === 0) transparentCount.push(1);
      if (r > 240 && g > 240 && b > 240) whiteCount.push(1);
      if (r < 80 && g < 80 && b < 80 && a > 80) inkCount.push(1);
    }
    const isTransparentBG = transparentCount.length > totalPixels * 0.4;
    const isWhiteBG = whiteCount.length > totalPixels * 0.4;
    if (!isTransparentBG && !isWhiteBG) {
      fs2.unlinkSync(filePath);
      return next(
        new AppError({
          message: "Signature must have a white or transparent background.",
          status: 400
        })
      );
    }
    if (inkCount.length < totalPixels * 3e-3) {
      fs2.unlinkSync(filePath);
      return next(
        new AppError({
          message: "Signature must contain visible strokes.",
          status: 400
        })
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};

// src/modules/upload/validator.ts
import { z as z4 } from "zod";
var uploadSchema = z4.object({
  type: z4.enum(["image", "file"], {
    message: "Type must be either 'image' or 'file'"
  }),
  usage: z4.string().min(1, "Usage is required").regex(/^[a-zA-Z0-9_-]+$/, {
    message: "Usage can only contain letters, numbers, hyphens, and underscores"
  })
});

// src/modules/upload/repository.ts
var uploadRepository = {
  create: (data) => {
    return prisma.upload.create({
      data,
      select: {
        id: true,
        filename: true,
        mimeType: true,
        extension: true,
        size: true,
        url: true,
        storageKey: true,
        category: true,
        uploaderId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },
  findById: (id2) => {
    return prisma.upload.findUnique({
      where: { id: id2 }
    });
  },
  deleteById: (id2) => {
    return prisma.upload.delete({
      where: { id: id2 }
    });
  }
};

// src/modules/upload/service.ts
import path2 from "path";
var uploadService = {
  saveFileMetadata: async (file, options) => {
    if (!file) {
      throw new AppError({ message: "No file provided", status: 400 });
    }
    const extension = path2.extname(file.originalname);
    const url = `${process.env.BASE_URL}/uploads/${file.destination.replace("uploads/", "")}/${file.filename}`;
    const storageKey = `${file.destination}/${file.filename}`;
    const upload2 = await uploadRepository.create({
      filename: file.filename,
      mimeType: file.mimetype,
      extension,
      size: file.size,
      url,
      storageKey,
      category: options.category,
      uploaderId: options.uploaderId
    });
    return upload2;
  },
  getFile: async (id2) => {
    const file = await uploadRepository.findById(id2);
    if (!file) {
      throw new AppError({ message: "File not found", status: 404 });
    }
    return file;
  },
  deleteFile: async (id2) => {
    const file = await uploadRepository.findById(id2);
    if (!file) {
      throw new AppError({ message: "File not found", status: 404 });
    }
    await uploadRepository.deleteById(id2);
    return { message: "File deleted successfully", id: id2 };
  }
};

// src/modules/upload/controller.ts
async function upload(req, res, next) {
  try {
    const validation = uploadSchema.safeParse({
      type: req.body.type || req.query.type,
      usage: req.body.usage || req.query.usage
    });
    if (!validation.success) {
      throw new AppError({
        message: validation.error.issues.map((e) => e.message).join(", "),
        status: 400,
        data: flattenZodErrors(validation.error)
      });
    }
    const file = req.file;
    if (!file) {
      throw new AppError({
        message: "No file uploaded",
        status: 400
      });
    }
    const input = validation.data;
    const savedFile = await uploadService.saveFileMetadata(file, {
      category: input.usage,
      // contoh: "user", "others"
      uploaderId: req.user?.id || null
      // kalau ada user login
    });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "File uploaded successfully",
      data: savedFile
    });
  } catch (err) {
    next(err);
  }
}

// src/modules/upload/routes.ts
var router3 = Router3();
router3.post(
  "/",
  uploadDynamic.single("file"),
  validateSignature,
  upload
);
var routes_default = router3;

// src/modules/category/route.ts
import { Router as Router4 } from "express";

// src/modules/category/repository.ts
var categoryRepository = {
  create: (data) => {
    return prisma.category.create({
      data,
      select: {
        id: true,
        name: true,
        prefix: true,
        isDevice: true,
        createdAt: true
      }
    });
  },
  update: (id2, data) => {
    return prisma.category.update({
      data,
      where: { id: id2, isDeleted: false },
      select: {
        id: true,
        name: true,
        prefix: true,
        isDevice: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },
  get: (skip, size, where) => {
    return prisma.category.findMany({
      skip,
      take: size,
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        prefix: true,
        isDevice: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },
  delete: (id2) => {
    return prisma.category.update({
      where: { id: id2 },
      data: { updatedAt: /* @__PURE__ */ new Date(), isDeleted: true }
    });
  },
  count: (where) => {
    return prisma.category.count({ where });
  },
  findByName: (name) => {
    return prisma.category.findFirst({
      where: { name, isDeleted: false }
    });
  },
  findById: (id2) => {
    return prisma.category.findUnique({
      where: { id: id2, isDeleted: false }
    });
  }
};

// src/modules/category/service.ts
var categoryService = {
  create: async ({
    name,
    prefix,
    isDevice
  }) => {
    const category = await categoryRepository.findByName(name);
    if (category) {
      throw new AppError({ message: "Category already exist", status: 400, data: { name } });
    }
    const result = await categoryRepository.create({ name, prefix, isDevice });
    return result;
  },
  get: async (page, size, search) => {
    const skip = (page - 1) * size;
    const where = search ? {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } }
      ]
    } : {};
    const [categories, total] = await Promise.all([
      categoryRepository.get(skip, size, { ...where, isDeleted: false }),
      categoryRepository.count(where)
    ]);
    return {
      data: categories,
      meta: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size)
      }
    };
  },
  update: async ({
    id: id2,
    name,
    prefix,
    isDevice
  }) => {
    const categoryById = await categoryRepository.findById(id2);
    if (!categoryById) {
      throw new AppError({ message: "Category not exist", status: 400, data: { categoryId: id2 } });
    }
    const categoryByName = await categoryRepository.findByName(name);
    if (categoryByName && categoryById.name !== name) {
      throw new AppError({ message: "Category already exist", status: 400, data: { name } });
    }
    const result = await categoryRepository.update(id2, {
      name,
      prefix,
      isDevice,
      updatedAt: /* @__PURE__ */ new Date()
    });
    return result;
  },
  delete: async (id2) => {
    const categoryById = await categoryRepository.findById(id2);
    if (!categoryById) {
      throw new AppError({ message: "Category not exist", status: 400, data: { categoryId: id2 } });
    }
    const result = await categoryRepository.delete(id2);
    return result;
  }
};

// src/modules/category/validator.ts
import { z as z5 } from "zod";
var categoryParamSchema = z5.object({
  name: z5.string().min(1, "Name is required"),
  prefix: z5.string().min(1, "Prefix is required"),
  isDevice: z5.boolean().optional().refine((val) => val !== void 0, {
    message: "isDevice is required"
  })
});

// src/modules/category/controller.ts
async function create(req, res, next) {
  try {
    const validation = categoryParamSchema.safeParse(req.body);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const category = await categoryService.create(req.body);
    return defaultResponse({
      response: res,
      success: true,
      status: 201,
      message: "Category create successfully",
      data: category
    });
  } catch (err) {
    next(err);
  }
}
async function get(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;
    const keyword = req.query.keyword || "";
    const result = await categoryService.get(page, size, keyword);
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Get categories successfully",
      data: result.data,
      meta: result.meta
    });
  } catch (err) {
    next(err);
  }
}
async function update(req, res, next) {
  try {
    const validation = categoryParamSchema.safeParse(req.body);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const id2 = req.params.id;
    const result = await categoryService.update({ ...req.body, id: id2 });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Update category successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}
async function deleteCategory(req, res, next) {
  try {
    const id2 = req.params.id;
    await categoryService.delete(id2);
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Delete category successfully",
      data: null
    });
  } catch (err) {
    next(err);
  }
}

// src/modules/category/route.ts
var router4 = Router4();
router4.post("/", checkUserToken, create);
router4.get("/", checkUserToken, get);
router4.put("/:id", checkUserToken, update);
router4.delete("/:id", checkUserToken, deleteCategory);
var route_default3 = router4;

// src/modules/assets/route.ts
import { Router as Router5 } from "express";

// src/modules/assets/repository.ts
var assetRepository = {
  create: (data) => {
    return prisma.asset.create({
      data,
      select: {
        id: true,
        name: true,
        code: true,
        isMaintenance: true,
        serialNumber: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            prefix: true,
            isDevice: true
          }
        }
      }
    });
  },
  update: (id2, data) => {
    return prisma.asset.update({
      data: { ...data, updatedAt: /* @__PURE__ */ new Date() },
      where: { id: id2, isDeleted: false },
      select: {
        id: true,
        name: true,
        code: true,
        isMaintenance: true,
        serialNumber: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            prefix: true,
            isDevice: true
          }
        }
      }
    });
  },
  get: async (skip, size, where) => {
    const grouped = await prisma.asset.groupBy({
      by: ["name"],
      where,
      _count: { name: true },
      orderBy: { name: "asc" },
      skip,
      take: size
    });
    const latestAssets = await Promise.all(
      grouped.map(async (g) => {
        const asset = await prisma.asset.findFirst({
          where: { name: g.name, ...where },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            code: true,
            isMaintenance: true,
            serialNumber: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            category: {
              select: {
                id: true,
                name: true,
                prefix: true,
                isDevice: true
              }
            }
          }
        });
        return { ...asset, quantity: g._count.name };
      })
    );
    return latestAssets;
  },
  getByName: (skip, size, where) => {
    return prisma.asset.findMany({
      skip,
      take: size,
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        code: true,
        isMaintenance: true,
        serialNumber: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            prefix: true,
            isDevice: true
          }
        }
      }
    });
  },
  delete: (id2) => {
    return prisma.asset.update({
      where: { id: id2 },
      data: { updatedAt: /* @__PURE__ */ new Date(), isDeleted: true }
    });
  },
  count: async (where, name) => {
    if (name !== "") {
      return prisma.asset.count({ where: { ...where, name } });
    } else {
      const totalGroups = await prisma.asset.groupBy({
        by: ["name"],
        where
      });
      return totalGroups.length;
    }
  },
  // findByName: (name: string) => {
  // 	return prisma.category.findFirst({
  // 		where: { name, isDeleted: false },
  // 	});
  // },
  findById: (id2) => {
    return prisma.asset.findUnique({
      where: { id: id2, isDeleted: false }
    });
  },
  findBySerialNumber: (serialNumber) => {
    return prisma.asset.findFirst({
      where: { serialNumber, isDeleted: false }
    });
  }
};

// src/modules/assets/service.ts
function generateCode(prefix) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:.TZ]/g, "").slice(0.12);
  const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${randomPart}`;
}
var assetService = {
  create: async ({
    name,
    serialNumber,
    isMaintenance,
    categoryId,
    image
  }) => {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new AppError({ message: "Category not exist", status: 404, data: { name } });
    }
    const assetBySerialNumber = await assetRepository.findBySerialNumber(serialNumber);
    if (assetBySerialNumber) {
      throw new AppError({
        message: "Asset serial number already exist",
        status: 404,
        data: { serialNumber }
      });
    }
    const result = await assetRepository.create({
      name,
      code: generateCode(category.prefix),
      serialNumber,
      isMaintenance,
      categoryId,
      image
    });
    return result;
  },
  get: async (page, size, search, name) => {
    const skip = (page - 1) * size;
    const where = search ? {
      OR: [
        { name: { contains: search } },
        { code: { contains: search } },
        { serialNumber: { contains: search } }
      ]
    } : {};
    const query = name !== "" ? assetRepository.getByName(skip, size, { ...where, isDeleted: false, name }) : assetRepository.get(skip, size, { ...where, isDeleted: false });
    const [assets, total] = await Promise.all([
      query,
      assetRepository.count(where, name)
    ]);
    return {
      data: assets,
      meta: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size)
      }
    };
  },
  update: async ({
    id: id2,
    name,
    serialNumber,
    isMaintenance,
    categoryId,
    image
  }) => {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new AppError({ message: "Category not exist", status: 404, data: { name } });
    }
    const assetById = await assetRepository.findById(id2);
    const assetBySerialNumber = await assetRepository.findBySerialNumber(serialNumber);
    if (assetBySerialNumber && assetById.serialNumber !== serialNumber) {
      throw new AppError({
        message: "Asset serial number already exist",
        status: 404,
        data: { serialNumber }
      });
    }
    const result = await assetRepository.update(id2, {
      name,
      serialNumber,
      isMaintenance,
      categoryId,
      image
    });
    return result;
  },
  delete: async (id2) => {
    const assetById = await assetRepository.findById(id2);
    if (!assetById) {
      throw new AppError({ message: "Asset not exist", status: 404, data: { categoryId: id2 } });
    }
    const result = await assetRepository.delete(id2);
    return result;
  }
};

// src/modules/assets/validator.ts
import { z as z6 } from "zod";
var assetParamSchema = z6.object({
  name: z6.string().min(1, "Name is required"),
  serialNumber: z6.string().optional(),
  image: z6.url("Image is required and use valid url").optional(),
  isMaintenance: z6.boolean().default(false),
  categoryId: z6.string().min(1, "Name is required")
});

// src/modules/assets/controller.ts
async function create2(req, res, next) {
  try {
    const validation = assetParamSchema.safeParse(req.body);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const result = await assetService.create(req.body);
    return defaultResponse({
      response: res,
      success: true,
      status: 201,
      message: "Asset create successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}
async function get2(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;
    const keyword = req.query.keyword || "";
    const name = req.params.name || "";
    const result = await assetService.get(page, size, keyword, name);
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Get assets successfully",
      data: result.data,
      meta: result.meta
    });
  } catch (err) {
    next(err);
  }
}
async function update2(req, res, next) {
  try {
    const validation = assetParamSchema.safeParse(req.body);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const id2 = req.params.id;
    const result = await assetService.update({ ...req.body, id: id2 });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Update assets successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}
async function deleteAsset(req, res, next) {
  try {
    const id2 = req.params.id;
    await assetService.delete(id2);
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Delete asset successfully",
      data: null
    });
  } catch (err) {
    next(err);
  }
}

// src/modules/assets/route.ts
var router5 = Router5();
router5.post("/", checkUserToken, create2);
router5.get("/", checkUserToken, get2);
router5.get("/:name", checkUserToken, get2);
router5.put("/:id", checkUserToken, update2);
router5.delete("/:id", checkUserToken, deleteAsset);
var route_default4 = router5;

// src/modules/approval/route.ts
import { Router as Router6 } from "express";

// src/modules/approval/repository.ts
import { Role as Role2 } from "@prisma/client";
var approvalRepository = {
  create: (data) => {
    return prisma.approval.create({
      data,
      select: {
        id: true,
        submissionType: true,
        status: true,
        notes: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            socialMedia: true,
            role: true,
            isActive: true
          }
        },
        requestedFor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            socialMedia: true,
            role: true,
            isActive: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });
  },
  createApprovalSignature: (approvalId, data) => {
    return prisma.approvalSignature.create({
      data: { ...data, approvalId }
    });
  },
  createApprovalAssets: (approvalId, data) => {
    return prisma.approvalAsset.create({
      data: { ...data, approvalId }
    });
  },
  update: (id2, data) => {
    return prisma.approval.update({
      data: { ...data, updatedAt: /* @__PURE__ */ new Date() },
      where: { id: id2, isDeleted: false },
      select: {
        id: true,
        submissionType: true,
        status: true,
        notes: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            socialMedia: true,
            role: true,
            isActive: true
          }
        },
        requestedFor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            socialMedia: true,
            role: true,
            isActive: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });
  },
  updateApprovalSignature: (id2, data) => {
    return prisma.approvalSignature.update({
      where: { id: id2 },
      data: {
        userId: data?.userId ?? null,
        name: data?.name ?? null,
        email: data?.email ?? null,
        isDeleted: data?.isDeleted ?? false,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
  },
  updateApprovalAssets: (id2, data) => {
    return prisma.approvalAsset.update({
      where: { id: id2 },
      data: {
        assetId: data?.assetId ?? null,
        name: data?.name ?? null,
        isMaintenance: data?.isMaintenance ?? null,
        serialNumber: data?.serialNumber ?? null,
        image: data?.image ?? null,
        categoryId: data?.categoryId ?? null,
        isDeleted: data?.isDeleted ?? false,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
  },
  updateStatus: (id2, data) => {
    return prisma.approval.update({
      data: { ...data, updatedAt: /* @__PURE__ */ new Date() },
      where: { id: id2, isDeleted: false },
      select: {
        id: true,
        submissionType: true,
        status: true,
        notes: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            socialMedia: true,
            role: true,
            isActive: true
          }
        },
        requestedFor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            socialMedia: true,
            role: true,
            isActive: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });
  },
  updatePosition: (id2, data) => {
    return prisma.approvalSignature.update({
      data: { ...data, updatedAt: /* @__PURE__ */ new Date() },
      where: { id: id2, isDeleted: false },
      select: {
        id: true,
        positionX: true,
        positionY: true,
        updatedAt: true
      }
    });
  },
  get: (skip, size, where) => {
    const selectFieldUser = {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true
    };
    return prisma.approval.findMany({
      skip,
      take: size,
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        submissionType: true,
        status: true,
        notes: true,
        createdBy: { select: selectFieldUser },
        requestedFor: { select: selectFieldUser },
        assets: {
          where: { isDeleted: false },
          select: {
            id: true,
            name: true,
            image: true,
            isMaintenance: true,
            serialNumber: true,
            categoryId: true,
            category: {
              select: {
                id: true,
                name: true,
                prefix: true,
                isDevice: true
              }
            },
            asset: {
              select: {
                id: true,
                name: true,
                code: true,
                isMaintenance: true,
                serialNumber: true,
                image: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    prefix: true,
                    isDevice: true
                  }
                }
              }
            },
            updatedAt: true
          }
        },
        signatures: {
          where: { isDeleted: false },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            positionX: true,
            positionY: true,
            signedAt: true,
            user: { select: selectFieldUser },
            updatedAt: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });
  },
  delete: (id2) => {
    return prisma.approval.update({
      where: { id: id2 },
      data: { updatedAt: /* @__PURE__ */ new Date(), isDeleted: true }
    });
  },
  count: (where) => {
    return prisma.approval.count({ where: { ...where, isDeleted: false } });
  },
  findById: (id2) => {
    return prisma.approval.findUnique({
      where: { id: id2, isDeleted: false }
    });
  },
  findDetailById: (id2) => {
    return prisma.approval.findUnique({
      where: { id: id2, isDeleted: false },
      select: {
        id: true,
        submissionType: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            role: true
          }
        },
        requestedFor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            role: true
          }
        },
        assets: {
          where: { isDeleted: false },
          select: {
            id: true,
            name: true,
            serialNumber: true,
            image: true,
            isMaintenance: true,
            category: {
              select: {
                id: true,
                name: true,
                prefix: true
              }
            },
            asset: {
              select: {
                id: true,
                name: true,
                code: true,
                serialNumber: true,
                image: true,
                isMaintenance: true
              }
            }
          }
        },
        signatures: {
          where: { isDeleted: false },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            positionX: true,
            positionY: true,
            signedAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                role: true
              }
            }
          }
        }
      }
    });
  },
  signatureFindById: (id2) => {
    return prisma.approvalSignature.findMany({
      where: { approvalId: id2 }
    });
  },
  findApprovers: (search) => {
    const where = {
      role: {
        in: [Role2.MANAGER, Role2.LEAD, Role2.COORDINATOR, Role2.GA]
      },
      isDeleted: false
    };
    if (search && search.trim() !== "") {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ];
    }
    return prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        image: true,
        isActive: true,
        updatedAt: true,
        createdAt: true
      },
      orderBy: {
        firstName: "asc"
      }
    });
  },
  signApproval: (id2, data) => {
    return prisma.approvalSignature.update({
      data: { ...data, signedAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
      where: { id: id2, isDeleted: false }
    });
  },
  findLatestSignature: async (userId) => {
    return prisma.approvalSignature.findFirst({
      where: {
        userId,
        isDeleted: false,
        image: {
          not: null
        },
        approval: {
          status: "DONE",
          isDeleted: false
        }
      },
      orderBy: {
        signedAt: "desc"
      }
    });
  }
};

// src/constants/Approval.ts
var SubmissionType = /* @__PURE__ */ ((SubmissionType2) => {
  SubmissionType2["PROCUREMENT"] = "PROCUREMENT";
  SubmissionType2["MAINTENANCE"] = "MAINTENANCE";
  SubmissionType2["WRITE_OFF"] = "WRITE_OFF";
  SubmissionType2["ASSIGNMENT"] = "ASSIGNMENT";
  return SubmissionType2;
})(SubmissionType || {});
var RequestStatus = /* @__PURE__ */ ((RequestStatus2) => {
  RequestStatus2["DRAFT"] = "DRAFT";
  RequestStatus2["WAITING_APPROVAL"] = "WAITING_APPROVAL";
  RequestStatus2["DONE"] = "DONE";
  RequestStatus2["REJECT"] = "REJECT";
  return RequestStatus2;
})(RequestStatus || {});

// src/lib/dateFns.ts
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { enUS, id } from "date-fns/locale";
var localeMap = {
  en: enUS,
  id
};
var formatDateToWIB = (isoString, options) => {
  try {
    const { withTime = true, lang = "id", formatPattern } = options || {};
    const timeZone = "Asia/Jakarta";
    const date = new Date(isoString);
    const zonedDate = toZonedTime(date, timeZone);
    const defaultPattern = withTime ? "dd MMMM yyyy HH:mm" : "dd MMMM yyyy";
    const pattern = formatPattern || defaultPattern;
    return format(zonedDate, pattern, { locale: localeMap[lang] || id });
  } catch {
    return "-";
  }
};

// src/modules/approval/service.ts
var buildApprovalWhere = (userId, role, search) => {
  const searchFilter = search ? {
    OR: [
      { submissionType: { contains: search.toUpperCase() } },
      { status: { contains: search.toUpperCase() } },
      { notes: { contains: search } }
    ]
  } : {};
  if (role === "GA" /* GA */) {
    return {
      ...searchFilter,
      isDeleted: false
    };
  }
  return {
    ...searchFilter,
    AND: [
      { isDeleted: false },
      {
        OR: [
          { createdById: userId },
          { requestedForId: userId },
          { signatures: { some: { userId } } }
        ]
      }
    ]
  };
};
var approvalService = {
  create: async (params) => {
    const {
      submissionType,
      status,
      notes,
      requestedForId,
      createdById,
      signatures,
      assets
    } = params;
    const profile = await userService.getById(createdById);
    const approval = await approvalRepository.create({
      submissionType,
      status,
      notes,
      requestedForId: requestedForId || null,
      createdById
    });
    let approvalAssets = null;
    let approvalSignatures = null;
    if (profile.role === "GA") {
      if (assets?.length > 0) {
        approvalAssets = await Promise.all(
          assets.map(async (asset) => {
            const result = await approvalRepository.createApprovalAssets(
              approval.id,
              asset
            );
            return removeObjectKeys(result, ["approvalId"]);
          })
        );
      }
      if (approvalSignatures?.length > 0) {
        approvalSignatures = await Promise.all(
          signatures.map(async (signature) => {
            const result = await approvalRepository.createApprovalSignature(
              approval.id,
              signature
            );
            return removeObjectKeys(result, ["approvalId"]);
          })
        );
      }
    }
    return {
      ...approval,
      sigantures: approvalSignatures,
      assets: approvalAssets
    };
  },
  get: async ({
    page,
    size,
    search,
    userId,
    role
  }) => {
    const skip = (page - 1) * size;
    const where = buildApprovalWhere(userId, role, search);
    const [approvals, total] = await Promise.all([
      approvalRepository.get(skip, size, { ...where, isDeleted: false }),
      approvalRepository.count(where)
    ]);
    const mappedApprovals = approvals.map((item) => {
      const signatures = item.signatures.map((signature) => ({
        ...signature,
        signedAt: signature.signedAt !== null ? formatDateToWIB(`${signature.signedAt}`) : null
      }));
      return {
        ...item,
        createdAt: formatDateToWIB(`${item.createdAt}`),
        updatedAt: formatDateToWIB(`${item.updatedAt}`),
        signatures
      };
    });
    return {
      data: mappedApprovals,
      meta: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size)
      }
    };
  },
  update: async (params) => {
    const approval = await approvalRepository.findById(params.id);
    if (!approval) {
      throw new AppError({
        message: "Approval not exist",
        status: 404,
        data: { approvalId: params.id }
      });
    }
    const {
      submissionType,
      status,
      notes,
      requestedForId,
      createdById,
      signatures,
      assets
    } = params;
    const result = await approvalRepository.update(params.id, {
      submissionType,
      status,
      notes,
      requestedForId,
      createdById
    });
    const approvalSignatures = await Promise.all(
      signatures.map(async (signature) => {
        if (signature.id) {
          const result2 = await approvalRepository.updateApprovalSignature(
            signature.id,
            signature
          );
          return removeObjectKeys(result2, ["approvalId", "isDeleted"]);
        } else {
          const result2 = await approvalRepository.createApprovalSignature(
            approval.id,
            signature
          );
          return removeObjectKeys(result2, ["approvalId", "isDeleted"]);
        }
      })
    );
    const approvalAssets = await Promise.all(
      assets.map(async (asset) => {
        if (asset.id) {
          const result2 = await approvalRepository.updateApprovalAssets(
            asset.id,
            asset
          );
          return removeObjectKeys(result2, ["approvalId", "isDeleted"]);
        } else {
          const result2 = await approvalRepository.createApprovalAssets(
            approval.id,
            asset
          );
          return removeObjectKeys(result2, ["approvalId", "isDeleted"]);
        }
      })
    );
    return {
      ...result,
      sigantures: approvalSignatures,
      assets: approvalAssets
    };
  },
  updateStatus: async (params) => {
    const approval = await approvalRepository.findById(params.id);
    if (!approval) {
      throw new AppError({
        message: "Approval not exist",
        status: 404,
        data: { approvalId: params.id }
      });
    }
    const result = await approvalRepository.updateStatus(params.id, {
      status: params.status
    });
    return result;
  },
  updatePosition: async (params) => {
    const approval = await approvalRepository.findDetailById(params.id);
    if (!approval) {
      throw new AppError({
        message: "Approval not exist",
        status: 404,
        data: { approvalId: params.id }
      });
    }
    const updateSignaturePromises = approval.signatures.map((sig) => {
      const found = params.signatures.find((item) => item.id === sig.id);
      if (!found) return Promise.resolve(null);
      return approvalRepository.updatePosition(sig.id, {
        positionX: found.positionX,
        positionY: found.positionY
      });
    });
    const result = await Promise.all(updateSignaturePromises);
    return result;
  },
  delete: async (id2) => {
    const approvalById = await approvalRepository.findById(id2);
    if (!approvalById) {
      throw new AppError({
        message: "Approval not exist",
        status: 404,
        data: { approvalId: id2 }
      });
    }
    const result = await approvalRepository.delete(id2);
    return result;
  },
  getApprovers: async (search) => {
    const users = await approvalRepository.findApprovers(search);
    const mappedUsers = users.map((user) => ({
      id: user.id,
      fullName: `${user.firstName} ${user.lastName || ""}`.trim(),
      email: user.email,
      role: user.role
    }));
    return mappedUsers;
  },
  getDetail: async (id2) => {
    const approval = await approvalRepository.findDetailById(id2);
    return approval;
  },
  signApproval: async (params) => {
    const result = await approvalRepository.signApproval(params.id, {
      image: params.image
    });
    return result;
  },
  checkAndUpdate: async (params) => {
    const approvalDetail = await approvalRepository.findDetailById(params.id);
    const unSign = approvalDetail.signatures.find((item) => !item.image || !item.signedAt);
    if (!unSign) {
      await approvalRepository.updateStatus(params.id, {
        status: "DONE" /* DONE */
      });
    }
  },
  getPreviousSignature: async (params) => {
    const signature = await approvalRepository.findLatestSignature(params.userId);
    return signature;
  }
};

// src/modules/approval/validator.ts
import { z as z7 } from "zod";
var approvalParamSchema = z7.object({
  submissionType: z7.enum(Object.values(SubmissionType)),
  status: z7.enum(Object.values(RequestStatus)).default("DRAFT"),
  notes: z7.string().optional()
});
var updateStatusSchema = z7.object({
  status: z7.enum(Object.values(RequestStatus))
});
var approverQuerySchema = z7.object({
  keyword: z7.string().optional().refine(
    (val) => !val || val.length >= 2,
    { message: "Keyword must be at least 2 characters when provided" }
  )
});

// src/modules/approval/controller.ts
async function create3(req, res, next) {
  try {
    const validation = approvalParamSchema.safeParse(req.body);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const { id: id2 } = req.user;
    const result = await approvalService.create({ ...req.body, createdById: id2 });
    return defaultResponse({
      response: res,
      success: true,
      status: 201,
      message: "Approval create successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}
async function get3(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.limit) || 10;
    const keyword = req.query.keyword || "";
    const result = await approvalService.get({
      page,
      size,
      search: keyword,
      userId: req.user.id,
      role: req.user.role
    });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Get approvals successfully",
      data: result.data,
      meta: result.meta
    });
  } catch (err) {
    next(err);
  }
}
async function update3(req, res, next) {
  try {
    const validation = approvalParamSchema.safeParse(req.body);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const approvalId = req.params.id;
    const result = await approvalService.update({ ...req.body, id: approvalId });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Process approval successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}
async function updateStatus(req, res, next) {
  try {
    const validation = updateStatusSchema.safeParse(req.body);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const approvalId = req.params.id;
    const result = await approvalService.updateStatus({ ...req.body, id: approvalId });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Update approval status successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}
async function updatePosition(req, res, next) {
  try {
    const approvalId = req.params.id;
    const result = await approvalService.updatePosition({ ...req.body, id: approvalId });
    await approvalService.updateStatus({ status: "WAITING_APPROVAL" /* WAITING_APPROVAL */, id: approvalId });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Update signature position successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}
async function deleteApproval(req, res, next) {
  try {
    const id2 = req.params.id;
    await approvalService.delete(id2);
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Delete approval successfully",
      data: null
    });
  } catch (err) {
    next(err);
  }
}
async function getApprovers(req, res, next) {
  try {
    const validation = approverQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return next(
        new AppError({
          message: "Validation error",
          status: 400,
          data: flattenZodErrors(validation.error)
        })
      );
    }
    const keyword = req.query.keyword || "";
    const result = await approvalService.getApprovers(keyword);
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Get approvers successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}
async function getDetail(req, res, next) {
  const result = await approvalService.getDetail(req.params.id);
  return defaultResponse({
    response: res,
    success: true,
    status: 200,
    message: "Get approval successfully",
    data: result
  });
}
async function getReviewedPosition(req, res, next) {
  try {
    const result = await approvalService.getDetail(req.params.id);
    const signatures = result?.signatures ?? [];
    const isReviewed = signatures.length > 0 && signatures.every((s) => s.positionX !== null && s.positionY !== null);
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Get signature reviewed successfully",
      data: {
        isReviewed
      }
    });
  } catch (error) {
    next(error);
  }
}
async function signApproval(req, res, next) {
  try {
    await approvalService.signApproval({ id: req.params.id, image: req.body.image });
    await approvalService.checkAndUpdate({ id: req.body.approvalId });
    return defaultResponse({
      response: res,
      success: true,
      status: 200,
      message: "Sign approval successfully"
    });
  } catch (error) {
    next(error);
  }
}
async function getPreviousSignature(req, res, next) {
  const result = await approvalService.getPreviousSignature({ userId: req.user.id });
  return defaultResponse({
    response: res,
    success: true,
    status: 200,
    message: "Get previous signature successfully",
    data: result?.image ? {
      image: result.image
    } : null
  });
}

// src/modules/approval/route.ts
var router6 = Router6();
router6.post("/", checkUserToken, create3);
router6.get("/", checkUserToken, get3);
router6.get("/detail/:id", checkUserToken, getDetail);
router6.put("/:id", checkUserToken, update3);
router6.put("/update-status/:id", checkUserToken, updateStatus);
router6.delete("/:id", checkUserToken, deleteApproval);
router6.get("/getApprovers", checkUserToken, getApprovers);
router6.put("/update-position/:id", checkUserToken, updatePosition);
router6.post("/sign-approval/:id", checkUserToken, signApproval);
router6.get("/get-previous-signature", checkUserToken, getPreviousSignature);
router6.get(
  "/signature-reviewed-position/:id",
  checkUserToken,
  getReviewedPosition
);
var route_default5 = router6;

// src/modules/history/route.ts
import express from "express";

// src/modules/history/repository.ts
import { PrismaClient as PrismaClient2 } from "@prisma/client";
var prisma2 = new PrismaClient2();
var approvalHistoryRepository = {
  create(data) {
    return prisma2.approvalHistory.create({
      data,
      include: {
        asset: true,
        approval: true,
        performedBy: true
      }
    });
  },
  findAll() {
    return prisma2.approvalHistory.findMany({
      include: {
        asset: true,
        approval: true,
        performedBy: true
      },
      orderBy: { createdAt: "desc" }
    });
  },
  findById(id2) {
    return prisma2.approvalHistory.findUnique({
      where: { id: id2 },
      include: {
        asset: true,
        approval: true,
        performedBy: true
      }
    });
  }
};

// src/modules/history/service.ts
var approvalHistoryService = {
  async createHistory(data) {
    return approvalHistoryRepository.create(data);
  },
  async getAllHistories() {
    return approvalHistoryRepository.findAll();
  },
  async getHistoryById(id2) {
    return approvalHistoryRepository.findById(id2);
  }
};

// src/modules/history/controller.ts
var approvalHistoryController = {
  async create(req, res) {
    try {
      const { type, description, assetId, approvalId, performedById } = req.body;
      const data = await approvalHistoryService.createHistory({
        type,
        description,
        assetId,
        approvalId,
        performedById
      });
      res.status(201).json({ message: "History created successfully", data });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  async getAll(req, res) {
    try {
      const data = await approvalHistoryService.getAllHistories();
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  async getById(req, res) {
    try {
      const { id: id2 } = req.params;
      const data = await approvalHistoryService.getHistoryById(id2);
      if (!data) return res.status(404).json({ message: "History not found" });
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

// src/modules/history/route.ts
var router7 = express.Router();
router7.post("/", approvalHistoryController.create);
router7.get("/", approvalHistoryController.getAll);
router7.get("/:id", approvalHistoryController.getById);
var route_default6 = router7;

// src/utils/logger.ts
import fs3 from "fs";
import path3 from "path";
import { createLogger, format as format2, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
var logDir = path3.join(process.cwd(), "logs");
if (!fs3.existsSync(logDir)) fs3.mkdirSync(logDir);
var isProduction = process.env.NODE_ENV === "production";
var projectRoot = process.cwd();
var logFormat = format2.combine(
  format2.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format2.errors({ stack: true }),
  format2.printf(({ timestamp, message, stack, traceId, ...meta }) => {
    const prefix = `[${timestamp}]`;
    const trace = traceId ? ` [Trace ID: ${traceId}]` : "";
    let log = "";
    if (stack) {
      const lines = stack.split("\n").map((line) => line.replace(projectRoot, ""));
      const firstLine = lines[0];
      const restLines = lines.slice(1).map((line) => `    ${line}`);
      log += `${prefix}${trace} ${firstLine}
${restLines.join("\n")}`;
    } else {
      log += `${prefix}${trace} ${message}`;
    }
    if (Object.keys(meta).length) {
      const formattedMeta = JSON.stringify(meta, null, isProduction ? 0 : 2);
      log += `
${formattedMeta}`;
    }
    log += "\n";
    return log;
  })
);
var logger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: path3.join(logDir, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      createSymlink: true,
      symlinkName: "app.log",
      auditFile: path3.join(logDir, ".audit.json"),
      level: "info"
    })
  ]
});
if (!isProduction) {
  logger.add(
    new transports.Console({
      format: logFormat,
      level: "info"
    })
  );
}
logger.logError = (err, traceId, context, extra) => {
  if (err instanceof Error) {
    const additional = extra || {};
    for (const key of Object.getOwnPropertyNames(err)) {
      if (!["message", "stack", "name"].includes(key)) {
        additional[key] = err[key];
      }
    }
    logger.error({
      name: err.name,
      message: err.message,
      stack: err.stack,
      traceId,
      context,
      ...additional
    });
  } else {
    const safeMessage = typeof err === "string" ? err : JSON.stringify(err, null, isProduction ? 0 : 2);
    logger.error({
      message: safeMessage,
      traceId,
      context,
      ...extra
    });
  }
};
logger.logInfo = (message, traceId, context, extra) => {
  const formattedExtra = extra ? JSON.parse(JSON.stringify(extra, null, isProduction ? 0 : 2)) : void 0;
  logger.info({
    message,
    traceId,
    context,
    ...formattedExtra
  });
};
var logger_default = logger;

// src/middlewares/requestLogger.ts
var requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const traceId = req.traceId || "no-trace-id";
    const context = `${req.method} ${req.originalUrl}`;
    const status = res.statusCode;
    const meta = res.logMeta || {};
    const logMessage = `${status} - ${duration}ms`;
    if (status >= 500) {
      logger_default.logError(new Error(logMessage), traceId, context, meta);
    } else if (status >= 400) {
      logger_default.logInfo(logMessage, traceId, context, { ...meta, level: "warn" });
    } else {
      logger_default.logInfo(logMessage, traceId, context, { logs: meta });
    }
  });
  res.addLogMeta = (extra) => {
    if (!res.logMeta) res.logMeta = [];
    res.logMeta.push(extra);
  };
  next();
};

// src/middlewares/errorHandler.ts
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError
} from "@prisma/client/runtime/library";
function errorHandler(err, req, res, _next) {
  const traceId = req.traceId || "no-trace-id";
  let errName = "";
  if (err instanceof Error) errName = err.name;
  logger_default.logError(err, traceId, `${req.method} ${req.originalUrl}`);
  res.setHeader("X-Trace-Id", traceId);
  if (err instanceof AppError) {
    return defaultResponse({
      response: res,
      status: err.status,
      message: err.message,
      success: false,
      data: err.data,
      traceId
    });
  }
  if (err instanceof PrismaClientKnownRequestError || (errName === "PrismaClientKnownRequestError" || errName === "PrismaClientInitializationError")) {
    return defaultResponse({
      response: res,
      status: 400,
      message: "Database request error",
      success: false,
      traceId
    });
  }
  if (errName === "MulterError") {
    return defaultResponse({
      response: res,
      status: 400,
      message: `Error upload: ${err.message}. ${err.code === "LIMIT_FILE_SIZE" ? "Maximum upload size is 5 MB" : ""}`,
      success: false,
      traceId
    });
  }
  if (err instanceof PrismaClientKnownRequestError || errName === "PrismaClientKnownRequestError") {
    return defaultResponse({
      response: res,
      status: 400,
      message: "Database request error",
      success: false,
      traceId
    });
  }
  if (err instanceof PrismaClientValidationError || errName === "PrismaClientValidationError") {
    return defaultResponse({
      response: res,
      status: 400,
      message: "Database validation error",
      success: false,
      traceId
    });
  }
  if (err instanceof Error) {
    return defaultResponse({
      response: res,
      status: 500,
      message: err.message || "Internal Server Error",
      success: false,
      traceId
    });
  }
  return defaultResponse({
    response: res,
    status: 500,
    message: "Unknown error",
    success: false,
    traceId
  });
}

// src/middlewares/traceId.ts
import { v4 as uuidv4 } from "uuid";
var traceIdMiddleware = (req, res, next) => {
  const traceId = uuidv4();
  req.traceId = traceId;
  res.setHeader("X-Trace-Id", traceId);
  next();
};

// src/app.ts
import path4 from "path";
var app = express2();
app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.FRONTEND_URL || ""
  ],
  credentials: true
}));
app.use(traceIdMiddleware);
app.use(express2.json());
app.use(requestLogger);
app.use("/api/users", route_default);
app.use("/api/authentication", route_default2);
app.use("/api/upload", routes_default);
app.use("/api/category", route_default3);
app.use("/api/assets", route_default4);
app.use("/api/approval", route_default5);
app.use("/api/history", route_default6);
var uploadDir = path4.join(process.cwd(), "uploads");
app.use("/uploads", express2.static(uploadDir));
app.use(errorHandler);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 3001;
app_default.listen(PORT, () => {
  console.log(`\u{1F680} Server running on http://localhost:${PORT}`);
});
