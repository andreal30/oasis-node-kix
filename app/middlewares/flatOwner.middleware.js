// Middleware to check flat ownership updated:2024-11-29
const flatOwnerMiddleware = async (req, res, next) => {
    try {
        if (!req.user) {
            logger.warn("User not authenticated in flatOwnerMiddleware");
            return res.status(401).json({ message: "User not authenticated" });
        }

        const flatId = req.params.id;

        if (req.path === '/bulk' && req.method === 'POST') {
            return next();
        }

        if (req.method === 'POST' && !flatId) {
            return next();
        }

        if (flatId) {
            const flat = await flat.findById(flatId);
            if (!flat) {
                logger.warn(`Flat not found: ${flatId}`);
                return res.status(404).json({ message: "Flat not found" });
            }

            if (flat.ownerId.toString() !== req.user.user_id && req.user.role !== 'admin') {
                logger.warn(`User ${req.user.user_id} attempted to access flat ${flatId} without ownership`);
                return res.status(403).json({ message: "Access denied. You don't own this flat." });
            }
        }

        next();
    } catch (error) {
        logger.error("Error in flatOwnerMiddleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { flatOwnerMiddleware };
