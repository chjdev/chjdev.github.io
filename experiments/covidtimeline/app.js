/* Disclaimer:
 * This was an experiment on writing a React app/dataviz without any bundlers
 * or JSX transpilers.
 *
 * I do not recommend this approach for production!
 * However I think React without JSX is actually surprisingly readable and
 * easy to write.
 */

const marginRatio = {top: 0.1, right: 0.1, bottom: 0.1, left: 0.1};
const margin = (width, height) => ({
    top: marginRatio.top * height,
    bottom: marginRatio.bottom * height,
    left: marginRatio.left * width,
    right: marginRatio.right * width,
});

const countyKeys = ["B", "K", "Noe", "Ooe", "S", "St", "T", "V", "W"];
const subKeys = ["_confirmed", "_death", "_recovered"];

const fetchData = async () =>
    new Promise((resolve, reject) =>
        d3.csv(
            "https://corin.at/raw.php?format=csv",
            (d) =>
                Object.assign(
                    d,
                    countyKeys.reduce(
                        (acc, key) =>
                            Object.assign(
                                acc,
                                subKeys.reduce((acc, subKey) => {
                                    acc[key + subKey] = Number(d[key + subKey]);
                                    return acc;
                                }, {}),
                            ),
                        {},
                    ),
                    {
                        dataTime: parseTime(d.dataTime),
                        viewedTime: parseTime(d.viewedTime),
                        total_confirmed: Number(d.total_confirmed),
                    },
                ),
            (data) => {
                data = data
                    .slice(data.findIndex(({total_confirmed}) => total_confirmed > 10))
                    .sort((a, b) => {
                        const aTime = a.dataTime.getTime();
                        const bTime = b.dataTime.getTime();
                        if (aTime === bTime) {
                            return a.viewedTime.getTime() - b.viewedTime.getTime();
                        } else {
                            return aTime - bTime;
                        }
                    })
                    .filter(({dataTime}, idx, rows) => {
                        if (idx >= rows.length - 1) {
                            return false;
                        }
                        const {dataTime: nextDataTime} = rows[idx + 1];
                        // most recently viewed is last in sorted order
                        return dataTime.getTime() !== nextDataTime.getTime();
                    });
                resolve(data);
            },
        ),
    );

const e = React.createElement;

const parseTime = d3.timeParse("%d.%m.%Y %H:%M:%S");

const LinearGradient = ({start, stop}) =>
    e(
        "linearGradient",
        {
            id: "svgGradient",
            x1: "0%",
            x2: "0%",
            y1: "0%",
            y2: "100%",
        },
        e("stop", {
            className: "start",
            offset: "0%",
            stopColor: start,
            stopOpacity: 1,
        }),
        e("stop", {
            className: "end",
            offset: "100%",
            stopColor: stop,
            stopOpacity: 1,
        }),
    );

const DropShadow = ({strokeWidth}) =>
    e(
        "filter",
        {
            id: "svgDropShadow",
            y: "-60%",
            height: "220%",
            x: "-30%",
            width: "160%",
        },
        e("feDropShadow", {
            dx: 0,
            dy: -0.5 * strokeWidth,
            stdDeviation: (strokeWidth / 4) * Math.log2(strokeWidth),
        }),
    );

const Lines = ({
                   keys,
                   data,
                   filter,
                   stroke,
                   strokeWidth,
                   width,
                   lineHeight,
                   overlap,
               }) => {
    const style = React.useMemo(() => ({filter}), [filter]);
    const dateExtent = React.useMemo(
        () => d3.extent(data.map(({dataTime}) => dataTime)),
        [data],
    );

    const keyData = React.useMemo(() => {
        const xScale = d3.scaleTime().range([0, width]).domain(dateExtent);
        return keys.map((key) => {
            const active = data.map((d) => [
                d.dataTime,
                d[key + "_confirmed"] - d[key + "_recovered"] - d[key + "_death"],
            ]);
            const extent = d3.extent(active.map(([, value]) => value));
            const yScale = d3
                .scaleLinear()
                .range([lineHeight + overlap, 0])
                .domain(extent);
            const line = d3
                .line()
                .curve(d3.curveCatmullRom.alpha(0.5))
                .x(([dataTime]) => xScale(dataTime))
                .y(([, amount]) => yScale(amount));
            return [key, line(active)];
        });
    }, [keys, data, lineHeight, overlap, width]);

    return e(
        "g",
        {
            className: "lines",
        },
        ...keyData.map(([dataKey, line], idx) =>
            e(
                "g",
                {
                    key: dataKey,
                    transform: `translate(0, ${idx * lineHeight})`,
                },
                e("path", {
                    className: "line " + dataKey,
                    stroke,
                    strokeWidth,
                    style,
                    strokeLinecap: "round",
                    fill: "none",
                    d: line,
                }),
            ),
        ),
    );
};

const legendTexts = {
    B: "Burgenland",
    K: "Kärnten",
    Noe: "Niederösterreich",
    Ooe: "Oberösterreich",
    S: "Salzburg",
    St: "Steiermark",
    T: "Tirol",
    V: "Vorarlberg",
    W: "Wien",
};

const Legend = ({keys, fontSize, lineHeight, color, overlap, filter}) => {
    const style = React.useMemo(() => ({filter}), [filter]);
    return e(
        "g",
        {className: "legend"},
        ...keys.map((dataKey, idx) =>
            e(
                "text",
                {
                    key: dataKey,
                    className: "legend-text " + dataKey,
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    textAnchor: "start",
                    fontSize,
                    fill: color,
                    stroke: "none",
                    x: 0,
                    y: (idx + 1) * (lineHeight + overlap) - idx * overlap,
                    style,
                },
                legendTexts[dataKey],
            ),
        ),
    );
};

const Axis = ({start, stop, fontSize, color, width}) => {
    const fontFamily = "sans-serif";
    const fontWeight = "bold";
    const fontDx = -0.475 * fontSize;
    const caretDx = -0.5 * fontSize;
    const caretDy = 0.9 * fontSize;
    const caretFontSize = 0.8 * fontSize;
    const fill = color;
    return e(
        "g",
        {className: "axis"},
        e(
            "text",
            {
                className: "axis-start-caret",
                x: 0,
                y: 0,
                dx: caretDx,
                dy: caretDy,
                textAnchor: "start",
                fontFamily,
                fontWeight,
                fontSize: caretFontSize,
                fill,
            },
            "▼",
        ),
        e(
            "text",
            {
                className: "axis-start",
                x: 0,
                y: 0,
                dx: fontDx,
                textAnchor: "start",
                fontFamily,
                fontWeight,
                fontSize,
                fill,
            },
            start,
        ),
        e(
            "text",
            {
                className: "axis-stop",
                x: width,
                y: 0,
                dx: -fontDx,
                textAnchor: "end",
                fontFamily,
                fontWeight,
                fontSize,
                fill,
            },
            stop,
        ),
        e(
            "text",
            {
                className: "axis-stop-caret",
                x: width,
                y: 0,
                dx: -caretDx,
                dy: caretDy,
                textAnchor: "end",
                fontFamily,
                fontWeight,
                fontSize: caretFontSize,
                fill,
            },
            "▼",
        ),
    );
};

const formatDate = d3.timeFormat("%B %d, %Y");
const Main = ({keys, x, y, width, height}) => {
    const today = new Date().toDateString();

    const [debounce, setDebounce] = React.useState(false);
    const [fullData, setFullData] = React.useState([]);

    const [animationFrame, setAnimationFrame] = React.useState(-1);
    const nextFrame = React.useCallback(() => setAnimationFrame(animationFrame +
        (animationFrame < fullData.length / 3 ? 7 : (animationFrame < 3 * (fullData.length / 4) ? 4 : 2))
    ), [animationFrame, fullData]);

    const [data, setData] = React.useState([]);


    React.useEffect(() => {
        if (animationFrame < 0) {
            fetchData().then((newFullData) => {
                setFullData(newFullData);
                setAnimationFrame(30);
            })
            return;
        }
        if (!debounce && animationFrame < fullData.length) {
            setDebounce(true);
            setTimeout(() => {
                setData(fullData.slice(0, animationFrame));
                nextFrame();
                setDebounce(false);
            }, 33);
        }
    }, [debounce, today, animationFrame, fullData]);

    const lineHeight = height / keys.length;
    const overlap = Math.sqrt(lineHeight);

    const strokeWidth = 0.33 * Math.sqrt(Math.min(height, width));
    const fontSize = 0.85 * Math.sqrt(Math.min(height, width));
    const tagFontSize = 0.6 * fontSize;
    const headlineFontSize = 1.5 * fontSize;
    if (data.length === 0) {
        return e(
            "text",
            {
                x: x + width / 2,
                y: y + height / 2.5,
                fontFamily: "sans-serif",
                fontWeight: "bold",
                textAnchor: "middle",
                fill: "white",
                fontSize,
            },
            "Loading...",
        );
    }
    return e(
        "g",
        {transform: `translate(${x}, ${y})`},
        e(LinearGradient, {start: "rgb(224, 36, 94)", stop: "rgb(121, 75, 196)"}),
        e(DropShadow, {strokeWidth}),
        e(
            "text",
            {
                className: "headline",
                x: width / 2,
                y: 0,
                dy:
                    y > 2 * headlineFontSize
                        ? -headlineFontSize
                        : y > 1.5 * headlineFontSize
                        ? -0.5 * headlineFontSize
                        : 0,
                textAnchor: "middle",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                fontSize: headlineFontSize,
                fill: "white",
            },
            "COVID19 Timeline by County",
        ),
        e(Axis, {
            start: formatDate(data[0].dataTime),
            stop: formatDate(data[data.length - 1].dataTime),
            width,
            fontSize: tagFontSize,
            color: "white",
        }),
        e(Lines, {
            keys: keys,
            lineHeight,
            overlap,
            strokeWidth,
            stroke: "url(#svgGradient)",
            filter: "url(#svgDropShadow)",
            width,
            data,
        }),
        e(Legend, {
            keys: keys,
            lineHeight,
            overlap,
            filter: "url(#svgDropShadow)",
            color: "white",
            fontSize,
        }),
        e(
            "a",
            {href: "https://twitter.com/chjdev"},
            e(
                "text",
                {
                    className: "tag",
                    x: width,
                    y: height,
                    dy: y > 5 * tagFontSize ? 3 * tagFontSize : 2 * tagFontSize,
                    textAnchor: "end",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    fontSize: tagFontSize,
                    fill: "white",
                },
                "https://chjdev.com/experiments/covidtimeline\u00A0\u00A0\u00A0\u00A0@chjdev",
            ),
        ),
    );
};

const containerStyle = {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
};
const Svg = () => {
    const [
        {left, right, top, bottom, containerWidth, containerHeight},
        setSize,
    ] = React.useState({
        containerWidth: 0,
        containerHeight: 0,
        ...margin(0),
    });

    const containerRef = React.useRef(null);
    React.useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            const {width: newWidth, height: jankyNewHeight} = entry.contentRect;
            // account for stupid mobile browsers... looking at you mobile safari
            const newHeight = jankyNewHeight - (document.querySelector("body").getClientRects()[0].height - window.innerHeight);
            window.requestAnimationFrame(() => {
                if (containerWidth !== newWidth || containerHeight !== newHeight) {
                    setSize({
                        containerWidth: newWidth,
                        containerHeight: newHeight,
                        ...margin(newWidth, newHeight),
                    });
                }
            });
        });
        observer.observe(containerRef.current);
        return () => observer.unobserve(containerRef.current);
    }, [containerRef]);

    const width = containerWidth - left - right;
    const height = containerHeight - top - bottom;
    return e(
        "div",
        {
            ref: containerRef,
            style: containerStyle,
        },
        e(
            "svg",
            {
                xmlns: "http://www.w3.org/2000/svg",
                width: containerWidth,
                height: containerHeight,
            },
            width > 0 &&
            height > 0 &&
            e(Main, {x: left, y: top, width, height, keys: countyKeys}),
        ),
    );
};

ReactDOM.render(e(Svg), document.querySelector("body"));
