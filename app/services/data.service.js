"use strict";

const requestPromise = require('request-promise-native');

const config = require('../resources/config.json');
const Product = require('../models/Product.model.js');

const service = {};

service.getAllProducts = async () => {
    const products = [];

    const requestOpts = {
        method: 'GET',
        url: `${config.dataServiceBaseUrl}/products`,
        qs: {
            token: config.token
        },
        json: true
    };
    const rawProductData = await requestPromise(requestOpts);

    // Convert retrieved data to local Product model instances
    rawProductData.forEach(rawProduct => {
        products.push( new Product(rawProduct) );
    });

    return products;
};

service.getRecommendedProducts = async () => {
    const products = [];

    const requestOpts = {
        method: 'GET',
        url: `${config.dataServiceBaseUrl}/shopperHistory`,
        qs: {
            token: config.token
        },
        json: true
    };

    const rawShopperHistoryData = await requestPromise(requestOpts);

    // get the distinct products with aggregated quantities
    const allProductsWithDuplicates = rawShopperHistoryData.reduce((accumulate, customer) => {
        return accumulate.concat(customer.products);
    }, []);

    const aggregatedProducts = allProductsWithDuplicates.reduce(function (distinctProducts, product) {
        if (distinctProducts[product.name]) {
            distinctProducts[product.name].quantity += product.quantity;
        } else {
            distinctProducts[product.name] = product;
        }
        return distinctProducts;
    }, {});

    // Convert retrieved data to local Product model instances
    Object.values(aggregatedProducts).forEach(rawProduct => {
        products.push( new Product(rawProduct) );
    });

    return products;
};

service.getTrolleyTotal = async (trolleyData) => {
    const requestOpts = {
        method: 'POST',
        url: `${config.dataServiceBaseUrl}/trolleyCalculator`,
        qs: {
            token: config.token
        },
        body: trolleyData,
        json: true
    };
    return await requestPromise(requestOpts);
};

module.exports = service;
