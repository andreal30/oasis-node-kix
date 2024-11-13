import logger from "../utils/logger.js";

const testLogs = async (req, res) => {
  try {
    // logger.error("This is an error");
    // logger.warn("This is a warn");
    // logger.info("This is an info");
    // logger.http("This is an http");
    // logger.verbose("This is a verbose");
    // logger.debug("This is a debug");
    // logger.silly("This is a silly");
    logger.error("This is an error");
    logger.warning("This is a warning");
    logger.info("This is an info");
    logger.debug("This is a debug");
    res.send({ message: "Logs test" });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export { testLogs };
