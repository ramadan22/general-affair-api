import { approvalHistoryService } from './service';
export const approvalHistoryController = {
    async create(req, res) {
        try {
            const { type, description, assetId, approvalId, performedById } = req.body;
            const data = await approvalHistoryService.createHistory({
                type,
                description,
                assetId,
                approvalId,
                performedById,
            });
            res.status(201).json({ message: 'History created successfully', data });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    async getAll(req, res) {
        try {
            const data = await approvalHistoryService.getAllHistories();
            res.status(200).json({ data });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            const data = await approvalHistoryService.getHistoryById(id);
            if (!data)
                return res.status(404).json({ message: 'History not found' });
            res.status(200).json({ data });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};
