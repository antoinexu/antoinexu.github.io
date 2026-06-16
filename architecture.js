// Renders a case-study architecture diagram as an inline SVG from structured
// data, so the same shape works in both English and Chinese and stays in sync
// with the site theme (colors come from CSS in style.css).
(function () {
    const NS = 'http://www.w3.org/2000/svg';

    function svgEl(tag, attrs, text) {
        const node = document.createElementNS(NS, tag);
        if (attrs) {
            for (const key in attrs) node.setAttribute(key, attrs[key]);
        }
        if (text != null) node.textContent = text;
        return node;
    }

    function nodeHeight(tier) {
        if (tier.items && tier.items.length) return 42 + tier.items.length * 22 + 10;
        if (tier.desc) return 64;
        return 46;
    }

    function drawNode(into, x, y, w, tier) {
        const h = nodeHeight(tier);
        into.push(svgEl('rect', { class: 'arch-node', x: x, y: y, width: w, height: h, rx: 10 }));
        const padX = x + 18;
        into.push(svgEl('text', { class: 'arch-node-title', x: padX, y: y + 28 }, tier.label));
        if (tier.desc) {
            into.push(svgEl('text', { class: 'arch-node-desc', x: padX, y: y + 49 }, tier.desc));
        }
        if (tier.items && tier.items.length) {
            let iy = y + 48;
            tier.items.forEach(function (item) {
                into.push(svgEl('text', { class: 'arch-node-item', x: padX, y: iy }, '•  ' + item));
                iy += 22;
            });
        }
        return h;
    }

    function drawArrow(into, x, y1, y2, label) {
        into.push(svgEl('line', { class: 'arch-line', x1: x, y1: y1, x2: x, y2: y2 - 7 }));
        into.push(svgEl('polygon', {
            class: 'arch-arrow',
            points: (x - 5) + ',' + (y2 - 8) + ' ' + (x + 5) + ',' + (y2 - 8) + ' ' + x + ',' + y2
        }));
        if (label) {
            into.push(svgEl('text', { class: 'arch-edge-label', x: x, y: (y1 + y2) / 2 + 4 }, label));
        }
    }

    function buildArchitectureSVG(arch) {
        const W = 540;
        const nodeW = 384;
        const nodeX = (W - nodeW) / 2;
        const cx = W / 2;
        const hostPadX = 22;
        const hostW = nodeW + hostPadX * 2;
        const hostX = (W - hostW) / 2;

        const back = [];   // host container, drawn behind
        const front = [];  // nodes, arrows, labels

        let y = 16;

        const clientH = drawNode(front, nodeX, y, nodeW, arch.client);
        y += clientH;

        const linkGap = arch.link ? 50 : 34;
        const hostTop = y + linkGap;
        drawArrow(front, cx, y, hostTop, arch.link);

        const hostHeaderH = 42;
        let innerY = hostTop + hostHeaderH;

        arch.tiers.forEach(function (tier, i) {
            if (i > 0) {
                const gap = tier.connector ? 46 : 32;
                drawArrow(front, cx, innerY, innerY + gap, tier.connector);
                innerY += gap;
            }
            innerY += drawNode(front, nodeX, innerY, nodeW, tier);
        });

        const hostBottom = innerY + 18;

        back.push(svgEl('rect', {
            class: 'arch-host', x: hostX, y: hostTop, width: hostW, height: hostBottom - hostTop, rx: 14
        }));
        back.push(svgEl('text', { class: 'arch-host-title', x: cx, y: hostTop + 26 }, arch.host));

        const totalH = hostBottom + 16;
        const svg = svgEl('svg', {
            class: 'arch-svg', viewBox: '0 0 ' + W + ' ' + totalH, role: 'img',
            preserveAspectRatio: 'xMidYMid meet'
        });
        if (arch.aria) svg.setAttribute('aria-label', arch.aria);

        back.forEach(function (e) { svg.appendChild(e); });
        front.forEach(function (e) { svg.appendChild(e); });
        return svg;
    }

    window.buildArchitectureSVG = buildArchitectureSVG;
})();
