const test = (req, res) => {
    res.status(200).json({ message: 'API Routes and Controllers are working!' });
}

module.exports = {
    test
};