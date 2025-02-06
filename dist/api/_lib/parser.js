"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRequest = void 0;
const url_1 = require("url");
function parseRequest(req) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = (0, url_1.parse)(req.url || '/', true);
    const { fontSize, images, widths, heights, theme, md } = (query || {});
    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }
    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }
    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    }
    else if (arr.length === 1) {
        text = arr[0];
    }
    else {
        extension = arr.pop();
        text = arr.join('.');
    }
    const parsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        theme: theme === 'purple' || theme === 'orange' || theme === 'green' || theme === 'pink' || theme === 'yellow' || theme === 'teal' || theme === 'blue' ? theme : 'purple',
        md: md === '1' || md === 'true',
        fontSize: fontSize || '96px',
        images: getArray(images),
        widths: getArray(widths),
        heights: getArray(heights),
    };
    parsedRequest.images = getDefaultImages(parsedRequest.images);
    return parsedRequest;
}
exports.parseRequest = parseRequest;
function getArray(stringOrArray) {
    if (typeof stringOrArray === 'undefined') {
        return [];
    }
    else if (Array.isArray(stringOrArray)) {
        return stringOrArray;
    }
    else {
        return [stringOrArray];
    }
}
function getDefaultImages(images) {
    const defaultImage = 'https://invibe-assets.s3.amazonaws.com/invibe-thread-logo.svg';
    if (!images || !images[0]) {
        return [defaultImage];
    }
    if (!images[0].startsWith('https://invibe-assets.s3.amazonaws.com/')) {
        images[0] = defaultImage;
    }
    return images;
}
