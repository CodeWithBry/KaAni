export const sendResponse = async (res, data) => {
    return res.status(200).json({ data });
}

export const sendError = async (req, errorMessage, status = 400) => {
    return res.status(status).json({ errorMessage });
}