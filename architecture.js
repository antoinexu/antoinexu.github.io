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

    function drawNode(into, x, y, w, tier, forcedH) {
        const h = forcedH || nodeHeight(tier);
        const cls = tier.accent ? 'arch-node arch-node-accent' : 'arch-node';
        into.push(svgEl('rect', { class: cls, x: x, y: y, width: w, height: h, rx: 10 }));
        const padX = x + 18;
        const titleCls = tier.accent ? 'arch-node-title arch-node-title-accent' : 'arch-node-title';
        into.push(svgEl('text', { class: titleCls, x: padX, y: y + 28 }, tier.label));
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

    function vline(into, x, y1, y2) {
        into.push(svgEl('line', { class: 'arch-line', x1: x, y1: y1, x2: x, y2: y2 }));
    }

    function hline(into, x1, x2, y) {
        into.push(svgEl('line', { class: 'arch-line', x1: x1, y1: y, x2: x2, y2: y }));
    }

    function arrowHead(into, x, y) {
        into.push(svgEl('polygon', {
            class: 'arch-arrow',
            points: (x - 5) + ',' + (y - 8) + ' ' + (x + 5) + ',' + (y - 8) + ' ' + x + ',' + y
        }));
    }

    function edgeLabel(into, x, y, label) {
        into.push(svgEl('text', { class: 'arch-edge-label', x: x, y: y }, label));
    }

    function drawArrow(into, x, y1, y2, label) {
        vline(into, x, y1, y2 - 7);
        arrowHead(into, x, y2);
        if (label) {
            edgeLabel(into, x, (y1 + y2) / 2 + 4, label);
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

    function buildFlowSVG(flow) {
        const W = 560;
        const wideX = 24;
        const wideW = 512;
        const colW = 248;
        const colX = [24, 288];
        const colC = [colX[0] + colW / 2, colX[1] + colW / 2];
        const cx = W / 2;

        function connect(into, prevCenters, centers, y1, y2, label, col) {
            if (col != null && prevCenters.length > 1) {
                drawArrow(into, centers[0], y1, y2, label);
                return;
            }
            if (prevCenters.length === centers.length) {
                centers.forEach(function (c, j) {
                    drawArrow(into, c, y1, y2, j === 0 ? label : null);
                });
                return;
            }
            const busY = Math.round((y1 + y2) / 2) - 4;
            const wide = prevCenters.length > centers.length ? prevCenters : centers;
            hline(into, wide[0], wide[wide.length - 1], busY);
            if (prevCenters.length > centers.length) {
                prevCenters.forEach(function (c) { vline(into, c, y1, busY); });
                vline(into, centers[0], busY, y2 - 7);
                arrowHead(into, centers[0], y2);
                if (label) edgeLabel(into, centers[0], (busY + y2) / 2 + 4, label);
            } else {
                vline(into, prevCenters[0], y1, busY);
                centers.forEach(function (c) {
                    vline(into, c, busY, y2 - 7);
                    arrowHead(into, c, y2);
                });
                if (label) edgeLabel(into, prevCenters[0], (y1 + busY) / 2 + 4, label);
            }
        }

        const out = [];
        let y = 16;
        let prevCenters = null;

        (flow.rows || []).forEach(function (row) {
            const centers = [];
            const boxes = [];
            if (row.nodes.length === 1 && row.col == null) {
                boxes.push({ x: wideX, w: wideW });
                centers.push(cx);
            } else {
                row.nodes.forEach(function (node, j) {
                    const c = row.nodes.length === 1 ? row.col : j;
                    boxes.push({ x: colX[c], w: colW });
                    centers.push(colC[c]);
                });
            }

            if (prevCenters) {
                const gap = row.connector ? 58 : 40;
                connect(out, prevCenters, centers, y, y + gap, row.connector, row.col);
                y += gap;
            }

            let rowH = 0;
            row.nodes.forEach(function (node) { rowH = Math.max(rowH, nodeHeight(node)); });
            boxes.forEach(function (box, j) {
                drawNode(out, box.x, y, box.w, row.nodes[j], rowH);
            });
            y += rowH;
            prevCenters = centers;
        });

        const svg = svgEl('svg', {
            class: 'arch-svg', viewBox: '0 0 ' + W + ' ' + (y + 16), role: 'img',
            preserveAspectRatio: 'xMidYMid meet'
        });
        if (flow.aria) svg.setAttribute('aria-label', flow.aria);
        out.forEach(function (e) { svg.appendChild(e); });
        return svg;
    }

    function buildFlowList(flow) {
        function el(tag, cls, text) {
            const node = document.createElement(tag);
            if (cls) node.className = cls;
            if (text != null) node.textContent = text;
            return node;
        }

        function drawItem(node) {
            const item = el('div', node.accent ? 'flow-node flow-node-accent' : 'flow-node');
            item.appendChild(el('strong', null, node.label));
            if (node.desc) item.appendChild(el('span', null, node.desc));
            return item;
        }

        const wrap = el('div', 'flow-list');
        let prev = null;

        (flow.rows || []).forEach(function (row) {
            if (prev) {
                const parts = [];
                if (row.col != null && prev.nodes.length > 1) {
                    const source = prev.nodes[row.col].label;
                    if (!row.connector || row.connector.indexOf(source) !== 0) parts.push(source);
                }
                if (row.connector) parts.push(row.connector);
                wrap.appendChild(el('p', 'flow-step', '↓' + (parts.length ? '  ' + parts.join('  ·  ') : '')));
            }
            const group = el('div', row.nodes.length > 1 ? 'flow-row flow-row-parallel' : 'flow-row');
            row.nodes.forEach(function (node) { group.appendChild(drawItem(node)); });
            wrap.appendChild(group);
            prev = row;
        });

        return wrap;
    }

    window.buildArchitectureSVG = buildArchitectureSVG;
    window.buildFlowSVG = buildFlowSVG;
    window.buildFlowList = buildFlowList;
})();
