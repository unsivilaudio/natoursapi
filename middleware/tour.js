const aliasTopTours = (req, res, next) => {
    req.query = {
        limit: 5,
        sort: '-ratingAverage,price',
        fields: 'name,price,ratingAverage,summary,difficulty',
    };
    next();
};

module.exports = { aliasTopTours };
