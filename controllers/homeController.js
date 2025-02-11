exports.getHome = async (req, res) => {
    res.render('index'); // Ensure 'index' template exists in 'views'
}
exports.getError = async (req, res) => {
    res.render('error'); // Ensure 'index' template exists in 'views'
}

// Export the function properly
