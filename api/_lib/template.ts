import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

function getCss(theme: string, fontSize: string) {
    let background = '#D6D3D1';
    let backgroundImage = 'linear-gradient(180deg, #F5F5F4 0%, #E7E5E4 100%)';
    let foreground = '#191721';

    if (theme === 'purple') {
        background = '#191721';
        backgroundImage = 'linear-gradient( 125deg, hsl(252deg 68% 62%) 0%, hsl(252deg 60% 57%) 7%, hsl(252deg 54% 52%) 15%, hsl(252deg 54% 47%) 23%, hsl(252deg 59% 43%) 32%, hsl(252deg 63% 38%) 42%, hsl(253deg 69% 34%) 52%, hsl(254deg 76% 30%) 62%, hsl(255deg 83% 26%) 73%, hsl(256deg 91% 22%) 85%, hsl(257deg 100% 18%) 100% );';
        foreground = '#D6D3D1';
    }

    if (theme === 'orange') {
        background = '#191721';
        backgroundImage = 'linear-gradient( 125deg, hsl(46deg 100% 46%) 0%, hsl(41deg 98% 47%) 7%, hsl(36deg 94% 48%) 15%, hsl(31deg 92% 49%) 23%, hsl(25deg 89% 51%) 32%, hsl(20deg 86% 52%) 42%, hsl(18deg 89% 45%) 52%, hsl(16deg 92% 38%) 62%, hsl(14deg 95% 31%) 73%, hsl(11deg 97% 25%) 85%, hsl(9deg 100% 18%) 100% );';
        foreground = '#D6D3D1';
    }

    if (theme === 'green') {
        background = '#191721';
        backgroundImage = 'linear-gradient( 125deg, hsl(79deg 93% 52%) 0%, hsl(87deg 95% 48%) 7%, hsl(95deg 96% 44%) 15%, hsl(103deg 97% 40%) 23%, hsl(111deg 99% 36%) 32%, hsl(119deg 100% 32%) 42%, hsl(122deg 100% 28%) 52%, hsl(126deg 100% 24%) 62%, hsl(130deg 100% 20%) 73%, hsl(134deg 100% 16%) 85%, hsl(137deg 100% 12%) 100% );';
        foreground = '#D6D3D1';
    }

    if (theme === 'pink') {
        background = '#191721';
        backgroundImage = 'linear-gradient( 125deg, hsl(0deg 100% 76%) 0%, hsl(351deg 86% 70%) 7%, hsl(343deg 75% 65%) 15%, hsl(335deg 68% 59%) 23%, hsl(328deg 62% 53%) 32%, hsl(320deg 67% 46%) 42%, hsl(322deg 70% 39%) 52%, hsl(324deg 75% 33%) 62%, hsl(326deg 82% 26%) 73%, hsl(329deg 92% 20%) 85%, hsl(334deg 100% 14%) 100% );';
        foreground = '#D6D3D1';
    }

    if (theme === 'yellow') {
        background = '#191721';
        backgroundImage = 'linear-gradient( 125deg, hsl(48deg 100% 49%) 0%, hsl(47deg 100% 47%) 7%, hsl(45deg 100% 46%) 15%, hsl(44deg 100% 44%) 23%, hsl(42deg 100% 42%) 32%, hsl(41deg 100% 40%) 42%, hsl(41deg 96% 34%) 52%, hsl(42deg 92% 28%) 62%, hsl(42deg 87% 22%) 73%, hsl(42deg 84% 16%) 85%, hsl(43deg 100% 9%) 100% );';
        foreground = '#D6D3D1';
    }

    if (theme === 'teal') {
        background = '#191721';
        backgroundImage = 'linear-gradient( 125deg, hsl(184deg 85% 52%) 0%, hsl(182deg 86% 43%) 7%, hsl(180deg 92% 35%) 15%, hsl(178deg 96% 30%) 23%, hsl(175deg 98% 25%) 32%, hsl(173deg 100% 21%) 42%, hsl(171deg 94% 18%) 52%, hsl(169deg 91% 15%) 62%, hsl(168deg 90% 12%) 73%, hsl(166deg 90% 9%) 85%, hsl(163deg 100% 6%) 100% );';
        foreground = '#D6D3D1';
    }

    if (theme === 'blue') {
        background = '#191721';
        backgroundImage = 'linear-gradient( 125deg, hsl(208deg 83% 63%) 0%, hsl(211deg 81% 59%) 7%, hsl(213deg 78% 55%) 15%, hsl(215deg 77% 51%) 23%, hsl(217deg 82% 48%) 32%, hsl(219deg 93% 44%) 42%, hsl(219deg 94% 38%) 52%, hsl(219deg 96% 32%) 62%, hsl(220deg 97% 26%) 73%, hsl(220deg 99% 20%) 85%, hsl(220deg 100% 14%) 100% );';
        foreground = '#D6D3D1';
    }

    return `
    @font-face {
        font-family: 'ABC Diatype Plus Variable';
        font-style: normal;
        font-weight: normal;
        src: 'url("https://st-cdn.invibe.co/fonts/diatype/ABCDiatypePlusVariable.woff2") format("woff2"), url("https://st-cdn.invibe.co/fonts/diatype/ABCDiatypePlusVariable.woff") format("woff")',
    }

    body {
        font-family: "ABC Diatype Plus Variable", "HelveticaNeue-Light",
    "Helvetica Neue Light", "Helvetica Neue", "Lucida Grande", "sans-serif";
        font-variation-settings: "wght" 500;
        background: ${background};
        background-image: ${backgroundImage};
        background-size: 100%;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: "ABC Diatype Plus Variable", "HelveticaNeue-Light",
    "Helvetica Neue Light", "Helvetica Neue", "Lucida Grande", "sans-serif";
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        mix-blend-mode: luminosity;
    }

    .logo {
        margin: 0 75px;
        mix-blend-mode: luminosity;
    }

    .plus {
        color: #A8A29E;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .heading {
        font-family: "ABC Diatype Plus Variable", "HelveticaNeue-Light",
    "Helvetica Neue Light", "Helvetica Neue", "Lucida Grande", "sans-serif";
        font-variation-settings: "wght" 500, "slnt" -7, "MONO" 0.5;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.2;
        mix-blend-mode: color-dodge;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images.map((img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                ).join('')}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
