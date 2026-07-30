/* @ds-bundle: {"format":4,"namespace":"TheBenAriDesignSystem_55844a","components":[{"name":"BirdField","sourcePath":"components/brand/BirdField.jsx"},{"name":"FlockMark","sourcePath":"components/brand/FlockMark.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Display","sourcePath":"components/core/Display.jsx"},{"name":"MetaLabel","sourcePath":"components/core/MetaLabel.jsx"},{"name":"ProjectCard","sourcePath":"components/core/ProjectCard.jsx"},{"name":"Rule","sourcePath":"components/core/Rule.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"}],"sourceHashes":{"components/brand/BirdField.jsx":"6ff6d3453add","components/brand/FlockMark.jsx":"98fbdc1ecfcf","components/brand/Wordmark.jsx":"6aa8fd724914","components/core/Button.jsx":"2b361a5bf404","components/core/Card.jsx":"63c77c5f3cf7","components/core/Display.jsx":"959041d37f4e","components/core/MetaLabel.jsx":"3e3bd9b091f8","components/core/ProjectCard.jsx":"5145416691c3","components/core/Rule.jsx":"9778d1970e7d","components/core/SectionHeading.jsx":"df3ffdb82ee0","components/core/Tag.jsx":"60b63f983331","components/forms/Input.jsx":"d0a1975483e1","components/forms/Textarea.jsx":"306b6d578baf","components/navigation/Footer.jsx":"4fc0d374e5e4","components/navigation/NavBar.jsx":"6b9f2cf538d3","slides/ClosingSlide.jsx":"bc2928e8225c","slides/SectionSlide.jsx":"7f633389fed3","slides/Slide.jsx":"a61488415410","slides/SoftPanelSlide.jsx":"88ce21912c02","slides/StatementSlide.jsx":"dd369ec719ed","slides/TitleSlide.jsx":"81af6202ce0a","slides/TwoColumnSlide.jsx":"bfda19c1373a","ui_kits/portfolio-site/Contact.jsx":"8116056b795b","ui_kits/portfolio-site/Events.jsx":"5e3348bd23d6","ui_kits/portfolio-site/Home.jsx":"98522cc3465b","ui_kits/portfolio-site/Project.jsx":"926f288a9fd5","ui_kits/portfolio-site/Work.jsx":"646d2c2015ac","ui_kits/portfolio-site/data.js":"25ce9c0b587a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TheBenAriDesignSystem_55844a = window.TheBenAriDesignSystem_55844a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/BirdField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  "ghost-paper": {
    file: "cream",
    opacity: 0.18
  },
  "ghost-blue": {
    file: "blue",
    opacity: 0.12
  },
  blue: {
    file: "blue",
    opacity: 1
  },
  cream: {
    file: "cream",
    opacity: 1
  },
  ink: {
    file: "ink",
    opacity: 1
  }
};

/** Oversized single-bird graphic punctuation — pre-coloured file, ghosted via opacity. */
function BirdField({
  bird = "glide",
  tone = "ghost-paper",
  size = 420,
  drift = false,
  assetBase = "assets",
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES["ghost-paper"];
  return /*#__PURE__*/React.createElement("img", _extends({
    src: `${assetBase}/birds/${bird}-${t.file}.svg`,
    alt: "",
    "aria-hidden": "true",
    width: size,
    height: size,
    style: {
      display: "block",
      width: size,
      height: size,
      objectFit: "contain",
      opacity: t.opacity,
      animation: drift ? "tba-drift var(--dur-drift) linear infinite" : undefined,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { BirdField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/BirdField.jsx", error: String((e && e.message) || e) }); }

// components/brand/FlockMark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SRC = {
  blue: "flock-blue.svg",
  cream: "flock-cream.svg",
  ink: "flock-ink.svg"
};

/** The three-goose flock mark. One pre-coloured file per tone — no CSS mask. */
function FlockMark({
  tone = "blue",
  size = 64,
  assetBase = "assets",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("img", _extends({
    src: `${assetBase}/${SRC[tone] || SRC.blue}`,
    alt: "The BenAri flock mark",
    width: size,
    height: size,
    style: {
      display: "inline-block",
      width: size,
      height: size,
      objectFit: "contain",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { FlockMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/FlockMark.jsx", error: String((e && e.message) || e) }); }

// components/brand/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Type-set logotype (no logotype file exists in the brand). */
function Wordmark({
  text = "THE BENARI",
  tone = "ink",
  size = 20,
  withMark = true,
  assetBase = "assets",
  style,
  ...rest
}) {
  const color = tone === "cream" ? "var(--paper)" : tone === "blue" ? "var(--blue)" : "var(--ink)";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      ...style
    }
  }, rest), withMark && /*#__PURE__*/React.createElement(__ds_scope.FlockMark, {
    tone: tone === "cream" ? "cream" : tone === "blue" ? "blue" : "ink",
    size: size * 1.5,
    assetBase: assetBase
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-black)",
      fontSize: size,
      letterSpacing: "var(--display-tracking)",
      lineHeight: 1,
      textTransform: "uppercase",
      color
    }
  }, text));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  fontFamily: "var(--font-body)",
  fontWeight: "var(--weight-medium)",
  textTransform: "uppercase",
  letterSpacing: "var(--label-tracking)",
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-2)",
  border: "1px solid transparent",
  borderRadius: "var(--radius-pill)",
  cursor: "pointer",
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: "background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out)"
};
const sizes = {
  sm: {
    fontSize: 11,
    padding: "8px 16px"
  },
  md: {
    fontSize: "var(--label)",
    padding: "12px 24px"
  },
  lg: {
    fontSize: 14,
    padding: "16px 32px"
  }
};
function Button({
  variant = "primary",
  size = "md",
  as = "button",
  disabled,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const variants = {
    primary: {
      background: down ? "var(--action-fill-press)" : hover ? "var(--action-fill-hover)" : "var(--action-fill)",
      color: down ? "var(--action-text-press)" : hover ? "var(--action-text-hover)" : "var(--action-text)",
      borderColor: hover && !down ? "var(--action-fill)" : "transparent"
    },
    accent: {
      background: down ? "var(--action-fill-press)" : hover ? "var(--action-accent-hover)" : "var(--action-accent-fill)",
      color: "var(--paper)"
    },
    secondary: {
      background: "transparent",
      color: "var(--text-body)",
      borderColor: "var(--text-body)",
      ...(hover && {
        background: "var(--text-body)",
        color: "var(--surface-page)"
      }),
      ...(down && {
        background: "var(--action-fill-press)",
        color: "var(--action-text-press)",
        borderColor: "var(--action-fill-press)"
      })
    },
    ghost: {
      background: hover ? "var(--surface-inset)" : "transparent",
      color: "var(--text-body)"
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    disabled: as === "button" ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      transform: down ? "scale(var(--press-scale))" : "none",
      opacity: disabled ? 0.35 : 1,
      pointerEvents: disabled ? "none" : undefined,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Flat panel: ground shift + hairline, no shadow. `soft` is the deck's 32px cream panel. */
function Card({
  variant = "flat",
  padding = "var(--space-6)",
  children,
  style,
  ...rest
}) {
  const variants = {
    flat: {
      background: "var(--surface-card)",
      border: "1px solid var(--line)",
      borderRadius: "var(--radius-0)"
    },
    soft: {
      background: "var(--surface-card)",
      border: "none",
      borderRadius: "var(--radius-xl)"
    },
    inset: {
      background: "var(--surface-inset)",
      border: "none",
      borderRadius: "var(--radius-0)"
    },
    dark: {
      background: "var(--surface-card-dark)",
      border: "1px solid var(--line-on-dark)",
      borderRadius: "var(--radius-0)",
      color: "var(--text-on-dark)"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      padding,
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Display.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  1: "var(--display-1)",
  2: "var(--display-2)",
  3: "var(--display-3)"
};

/** Oversized all-caps display type — the brand's loudest element. */
function Display({
  level = 1,
  as = "h1",
  tone = "default",
  align = "left",
  children,
  style,
  ...rest
}) {
  const color = {
    default: "var(--text-display)",
    onDark: "var(--text-on-dark)",
    blue: "var(--blue)",
    cream: "var(--paper-warm)"
  }[tone];
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-black)",
      fontSize: sizes[level],
      lineHeight: "var(--display-leading)",
      letterSpacing: "var(--display-tracking)",
      textTransform: "uppercase",
      color,
      textAlign: align,
      margin: 0,
      textWrap: "balance",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Display });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Display.jsx", error: String((e && e.message) || e) }); }

// components/core/MetaLabel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The deck's tiny corner metadata: optional two-digit index + uppercase text. */
function MetaLabel({
  index,
  tone = "muted",
  children,
  style,
  ...rest
}) {
  const color = {
    muted: "var(--text-muted)",
    strong: "var(--text-body)",
    onDark: "var(--text-on-dark-muted)",
    accent: "var(--blue)"
  }[tone];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--label)",
      fontWeight: "var(--weight-medium)",
      textTransform: "uppercase",
      letterSpacing: "var(--label-tracking)",
      lineHeight: "var(--label-leading)",
      color,
      display: "inline-flex",
      gap: "var(--space-3)",
      ...style
    }
  }, rest), index != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--blue)"
    }
  }, String(index).padStart(2, "0")), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { MetaLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MetaLabel.jsx", error: String((e && e.message) || e) }); }

// components/core/Rule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Rule({
  weight = "hair",
  tone = "default",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("hr", _extends({
    style: {
      border: 0,
      height: weight === "heavy" ? 2 : 1,
      background: tone === "onDark" ? "var(--line-on-dark)" : weight === "heavy" ? "var(--text-body)" : "var(--line)",
      width: "100%",
      margin: 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Rule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Rule.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Numbered label + display title + optional intro, the standard section opener. */
function SectionHeading({
  index,
  label,
  title,
  intro,
  tone = "default",
  style,
  ...rest
}) {
  const onDark = tone === "onDark";
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      display: "grid",
      gap: "var(--space-5)",
      ...style
    }
  }, rest), (label || index != null) && /*#__PURE__*/React.createElement(__ds_scope.MetaLabel, {
    index: index,
    tone: onDark ? "onDark" : "muted"
  }, label), /*#__PURE__*/React.createElement(__ds_scope.Display, {
    level: 2,
    as: "h2",
    tone: onDark ? "onDark" : tone === "blue" ? "blue" : "default"
  }, title), intro && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--body-lg)",
      lineHeight: "var(--body-leading)",
      letterSpacing: "var(--body-tracking)",
      color: onDark ? "var(--text-on-dark-muted)" : "var(--text-muted)",
      maxWidth: "var(--measure)",
      margin: 0,
      textWrap: "pretty"
    }
  }, intro));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  tone = "outline",
  children,
  style,
  ...rest
}) {
  const tones = {
    outline: {
      background: "transparent",
      color: "var(--text-body)",
      border: "1px solid var(--line)"
    },
    solid: {
      background: "var(--action-fill)",
      color: "var(--action-text)",
      border: "1px solid transparent"
    },
    blue: {
      background: "var(--blue)",
      color: "var(--paper)",
      border: "1px solid transparent"
    },
    inset: {
      background: "var(--surface-inset)",
      color: "var(--text-body)",
      border: "1px solid transparent"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--label)",
      fontWeight: "var(--weight-medium)",
      textTransform: "uppercase",
      letterSpacing: "var(--label-tracking)",
      lineHeight: 1,
      padding: "6px 12px",
      borderRadius: "var(--radius-pill)",
      display: "inline-block",
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/ProjectCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Work item: square image well, category tags, title, year. Lifts 2px on hover. */
function ProjectCard({
  title,
  category,
  year,
  image,
  imageAlt = "",
  index,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "grid",
      gap: "var(--space-4)",
      cursor: onClick ? "pointer" : "default",
      transform: hover ? "var(--hover-shift)" : "none",
      transition: "transform var(--dur) var(--ease-out)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4 / 3",
      overflow: "hidden",
      background: "var(--surface-inset)",
      borderRadius: "var(--radius-0)"
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transform: hover ? "scale(1.02)" : "none",
      transition: "transform var(--dur-slow) var(--ease-out)"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.MetaLabel, null, "Image")), index != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "var(--space-3)",
      left: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    tone: "solid"
  }, String(index).padStart(2, "0")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-black)",
      fontSize: 22,
      letterSpacing: "var(--heading-tracking)",
      lineHeight: 1.05,
      textTransform: "uppercase",
      color: "var(--text-body)",
      margin: 0,
      textDecoration: hover ? "underline" : "none",
      textDecorationThickness: "1px",
      textUnderlineOffset: "4px"
    }
  }, title), year && /*#__PURE__*/React.createElement(__ds_scope.MetaLabel, null, year)), category && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)"
    }
  }, [].concat(category).map(c => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: c
  }, c))));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const field = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--body)",
  lineHeight: "var(--body-leading)",
  color: "var(--text-body)",
  background: "transparent",
  border: 0,
  borderBottom: "1px solid var(--line)",
  borderRadius: 0,
  padding: "var(--space-3) 0",
  width: "100%",
  outline: "none",
  transition: "border-color var(--dur) var(--ease-out)"
};
function Input({
  label,
  hint,
  invalid,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "grid",
      gap: "var(--space-2)"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--label)",
      fontWeight: "var(--weight-medium)",
      textTransform: "uppercase",
      letterSpacing: "var(--label-tracking)",
      color: "var(--text-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...field,
      borderBottomColor: invalid ? "var(--blue)" : focus ? "var(--text-body)" : "var(--line)",
      borderBottomWidth: focus || invalid ? 2 : 1,
      ...style
    }
  }, rest)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--body-sm)",
      color: invalid ? "var(--blue)" : "var(--text-muted)"
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  label,
  hint,
  rows = 4,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "grid",
      gap: "var(--space-2)"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--label)",
      fontWeight: "var(--weight-medium)",
      textTransform: "uppercase",
      letterSpacing: "var(--label-tracking)",
      color: "var(--text-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--body)",
      lineHeight: "var(--body-leading)",
      color: "var(--text-body)",
      background: "transparent",
      border: 0,
      borderBottom: `${focus ? 2 : 1}px solid ${focus ? "var(--text-body)" : "var(--line)"}`,
      padding: "var(--space-3) 0",
      width: "100%",
      outline: "none",
      resize: "vertical",
      ...style
    }
  }, rest)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--body-sm)",
      color: "var(--text-muted)"
    }
  }, hint));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Ink footer: oversized wordmark, link columns, corner metadata. */
function Footer({
  columns = [],
  note,
  email,
  assetBase = "assets",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({
    style: {
      background: "var(--ink)",
      color: "var(--text-on-dark)",
      padding: "var(--space-9) var(--page-margin) var(--space-6)",
      display: "grid",
      gap: "var(--space-8)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    tone: "cream",
    size: 28,
    assetBase: assetBase
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-8)",
      flexWrap: "wrap"
    }
  }, columns.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.title,
    style: {
      display: "grid",
      gap: "var(--space-3)",
      alignContent: "start"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.MetaLabel, {
    tone: "onDark"
  }, col.title), col.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href || "#",
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--body)",
      color: "var(--paper)",
      textDecoration: "none",
      borderBottom: "1px solid transparent"
    }
  }, l.label)))))), email && /*#__PURE__*/React.createElement("a", {
    href: `mailto:${email}`,
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-black)",
      fontSize: "var(--display-3)",
      letterSpacing: "var(--display-tracking)",
      lineHeight: 1,
      textTransform: "uppercase",
      color: "var(--paper)",
      textDecoration: "none"
    }
  }, email), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--space-5)",
      borderTop: "1px solid var(--line-on-dark)",
      paddingTop: "var(--space-5)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.MetaLabel, {
    tone: "onDark"
  }, note), /*#__PURE__*/React.createElement(__ds_scope.MetaLabel, {
    tone: "onDark"
  }, "\xA9 ", new Date().getFullYear())));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Sticky top bar: wordmark left, uppercase links right, one action. */
function NavBar({
  items = [],
  active,
  onNavigate,
  tone = "light",
  cta,
  scrolled = false,
  assetBase = "assets",
  style,
  ...rest
}) {
  const onDark = tone !== "light";
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-6)",
      padding: "var(--space-4) var(--page-margin)",
      background: scrolled ? onDark ? "rgba(36,30,26,.85)" : "rgba(237,233,228,.85)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${onDark ? "var(--line-on-dark)" : "var(--line)"}` : "1px solid transparent",
      boxShadow: scrolled ? "var(--shadow-lift)" : "none",
      transition: "background var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate && onNavigate(items[0]?.id),
    style: {
      background: "none",
      border: 0,
      padding: 0,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    tone: onDark ? "cream" : "ink",
    size: 16,
    assetBase: assetBase
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-6)"
    }
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    onClick: () => onNavigate && onNavigate(it.id),
    style: {
      background: "none",
      border: 0,
      padding: "4px 0",
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      fontSize: "var(--label)",
      fontWeight: "var(--weight-medium)",
      textTransform: "uppercase",
      letterSpacing: "var(--label-tracking)",
      color: onDark ? active === it.id ? "var(--paper)" : "var(--text-on-dark-muted)" : active === it.id ? "var(--ink)" : "var(--ink-55)",
      borderBottom: `1px solid ${active === it.id ? "currentColor" : "transparent"}`
    }
  }, it.label)), cta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: onDark ? "secondary" : "primary",
    size: "sm",
    onClick: cta.onClick,
    style: onDark ? {
      color: "var(--paper)",
      borderColor: "var(--paper)"
    } : undefined
  }, cta.label)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// slides/ClosingSlide.jsx
try { (() => {
const {
  Display,
  FlockMark
} = window.TheBenAriDesignSystem_55844a;
function ClosingSlide() {
  return /*#__PURE__*/React.createElement(Slide, {
    ground: "ink",
    topLeft: "Presented by / BenAri",
    topRight: "27 September 2024",
    bottomLeft: "hello@thebenari.com",
    bottomRight: "thebenari.com"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "grid",
      alignContent: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(Display, {
    level: 1,
    tone: "onDark",
    style: {
      fontSize: 132
    }
  }, "Thank", /*#__PURE__*/React.createElement("br", null), "you"), /*#__PURE__*/React.createElement(FlockMark, {
    tone: "cream",
    size: 72,
    assetBase: "../assets"
  })));
}
Object.assign(window, {
  ClosingSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/ClosingSlide.jsx", error: String((e && e.message) || e) }); }

// slides/SectionSlide.jsx
try { (() => {
const {
  Display
} = window.TheBenAriDesignSystem_55844a;
function SectionSlide() {
  return /*#__PURE__*/React.createElement(Slide, {
    ground: "paper",
    topLeft: "03",
    topRight: "Brand",
    bottomLeft: "The BenAri",
    bottomRight: "03 / 10"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "grid",
      alignContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Display, {
    level: 2,
    tone: "blue",
    style: {
      fontSize: 104
    }
  }, "About", /*#__PURE__*/React.createElement("br", null), "the brand")));
}
Object.assign(window, {
  SectionSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/SectionSlide.jsx", error: String((e && e.message) || e) }); }

// slides/Slide.jsx
try { (() => {
const {
  MetaLabel
} = window.TheBenAriDesignSystem_55844a;

/** 1280x720 slide frame. Grounds: ink | paper | blue. */
function Slide({
  ground = "ink",
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  children,
  style
}) {
  const bg = {
    ink: "var(--ink)",
    paper: "var(--paper)",
    blue: "var(--blue)"
  }[ground];
  const onDark = ground !== "paper";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1280,
      height: 720,
      background: bg,
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-body)",
      color: onDark ? "var(--paper)" : "var(--ink)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      padding: 64,
      display: "grid",
      gridTemplateRows: "auto 1fr auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 32,
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    tone: onDark ? "onDark" : "muted"
  }, topLeft), /*#__PURE__*/React.createElement(MetaLabel, {
    tone: onDark ? "onDark" : "muted"
  }, topRight)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      minHeight: 0
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 32,
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    tone: onDark ? "onDark" : "muted"
  }, bottomLeft), /*#__PURE__*/React.createElement(MetaLabel, {
    tone: onDark ? "onDark" : "muted"
  }, bottomRight))));
}
const Cols = ({
  children,
  gap = 48
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap
  }
}, children);
const Body = ({
  children,
  tone = "dark"
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.5,
    textAlign: "justify",
    color: tone === "dark" ? "var(--paper-70)" : "var(--ink-55)"
  }
}, children);
Object.assign(window, {
  Slide,
  Cols,
  Body
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/Slide.jsx", error: String((e && e.message) || e) }); }

// slides/SoftPanelSlide.jsx
try { (() => {
const {
  Display,
  Card
} = window.TheBenAriDesignSystem_55844a;
function SoftPanelSlide() {
  return /*#__PURE__*/React.createElement(Slide, {
    ground: "ink",
    topLeft: "01",
    topRight: "Introduction",
    bottomLeft: "The BenAri",
    bottomRight: "02 / 10"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 40,
      height: "100%",
      alignContent: "start"
    }
  }, /*#__PURE__*/React.createElement(Display, {
    level: 2,
    tone: "onDark",
    style: {
      fontSize: 84
    }
  }, "Introduction"), /*#__PURE__*/React.createElement(Card, {
    variant: "soft",
    padding: 32,
    style: {
      background: "var(--paper-warm)",
      borderRadius: "var(--radius-xl)",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement(Cols, null, /*#__PURE__*/React.createElement(Body, {
    tone: "light"
  }, "The practice sits between AI research and live work: models are the material, and an audience is the test. This deck sets out how that reads as a brand."), /*#__PURE__*/React.createElement(Body, {
    tone: "light"
  }, "Everything here derives from two things: four flat grounds and one figurative asset. Nothing else is needed, and adding more weakens both.")))));
}
Object.assign(window, {
  SoftPanelSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/SoftPanelSlide.jsx", error: String((e && e.message) || e) }); }

// slides/StatementSlide.jsx
try { (() => {
const {
  Display,
  BirdField
} = window.TheBenAriDesignSystem_55844a;
function StatementSlide() {
  return /*#__PURE__*/React.createElement(Slide, {
    ground: "blue",
    topLeft: "08",
    topRight: "Approach",
    bottomLeft: "The BenAri",
    bottomRight: "08 / 10"
  }, /*#__PURE__*/React.createElement(BirdField, {
    bird: "glide",
    tone: "ghost-paper",
    size: 420,
    assetBase: "../assets",
    style: {
      position: "absolute",
      left: -70,
      bottom: -100,
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "grid",
      alignContent: "center",
      justifyItems: "end",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Display, {
    level: 2,
    tone: "onDark",
    align: "right",
    style: {
      fontSize: 88,
      maxWidth: "16ch"
    }
  }, "Make it, then show it to strangers")));
}
Object.assign(window, {
  StatementSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/StatementSlide.jsx", error: String((e && e.message) || e) }); }

// slides/TitleSlide.jsx
try { (() => {
const {
  Display,
  BirdField
} = window.TheBenAriDesignSystem_55844a;
function TitleSlide() {
  return /*#__PURE__*/React.createElement(Slide, {
    ground: "ink",
    topLeft: "Presented by / BenAri",
    topRight: "27 September 2024",
    bottomLeft: "hello@thebenari.com",
    bottomRight: "thebenari.com"
  }, /*#__PURE__*/React.createElement(BirdField, {
    bird: "climb",
    tone: "ghost-paper",
    size: 460,
    assetBase: "../assets",
    style: {
      position: "absolute",
      right: -80,
      top: -40,
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(Display, {
    level: 1,
    tone: "onDark",
    style: {
      fontSize: 132
    }
  }, "Brand", /*#__PURE__*/React.createElement("br", null), "strategy")));
}
Object.assign(window, {
  TitleSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/TitleSlide.jsx", error: String((e && e.message) || e) }); }

// slides/TwoColumnSlide.jsx
try { (() => {
const {
  MetaLabel
} = window.TheBenAriDesignSystem_55844a;
function TwoColumnSlide() {
  return /*#__PURE__*/React.createElement(Slide, {
    ground: "paper",
    topLeft: "05",
    topRight: "Audience",
    bottomLeft: "The BenAri",
    bottomRight: "05 / 10"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 24,
      alignContent: "center",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(Cols, {
    gap: 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    index: 1
  }, "Who it is for"), /*#__PURE__*/React.createElement(Body, {
    tone: "light"
  }, "Curators, festival programmers and studio leads who need work that survives contact with a real room. They book on evidence: what ran, where, and how it held up.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    index: 2
  }, "What they want"), /*#__PURE__*/React.createElement(Body, {
    tone: "light"
  }, "Not novelty. A collaborator who can build the thing, stand in front of it, and write down honestly what happened afterwards.")))));
}
Object.assign(window, {
  TwoColumnSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/TwoColumnSlide.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-site/Contact.jsx
try { (() => {
const {
  Display,
  MetaLabel,
  Rule,
  Button,
  Card,
  Input,
  Textarea,
  FlockMark
} = window.TheBenAriDesignSystem_55844a;
function Contact() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--space-9) var(--page-margin) var(--section-y)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-9)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    index: 4
  }, "Contact"), /*#__PURE__*/React.createElement(Display, {
    level: 2
  }, "Say hello"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: "44ch",
      fontSize: "var(--body-lg)",
      lineHeight: "var(--body-leading)",
      color: "var(--text-muted)"
    }
  }, "Commissions, residencies, speaking, or a night you want built. I answer everything within a week."), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-4)"
    }
  }, [["Email", "hello@thebenari.com"], ["Studio", "London, E8"], ["Elsewhere", "Instagram · LinkedIn"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "grid",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, null, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--body)"
    }
  }, v)))), /*#__PURE__*/React.createElement(FlockMark, {
    size: 88,
    assetBase: "../../assets"
  })), /*#__PURE__*/React.createElement(Card, {
    variant: "soft",
    padding: "var(--space-7)",
    style: {
      background: "var(--paper-warm)"
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-4)",
      justifyItems: "start",
      minHeight: 320,
      alignContent: "center"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    tone: "accent"
  }, "Sent"), /*#__PURE__*/React.createElement(Display, {
    level: 3,
    as: "div"
  }, "Thank you"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--text-muted)",
      fontSize: "var(--body)"
    }
  }, "I will reply from hello@thebenari.com."), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setSent(false)
  }, "Send another")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, null, "Enquiry"), /*#__PURE__*/React.createElement(Input, {
    label: "Name",
    placeholder: "Your name",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "you@studio.com",
    required: true
  }), /*#__PURE__*/React.createElement(Textarea, {
    label: "Project",
    rows: 5,
    placeholder: "What are you making?",
    hint: "A paragraph is plenty."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    type: "submit",
    style: {
      justifySelf: "start"
    }
  }, "Send enquiry")))));
}
Object.assign(window, {
  Contact
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-site/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-site/Events.jsx
try { (() => {
const {
  Display,
  MetaLabel,
  Tag,
  Rule,
  Button,
  BirdField
} = window.TheBenAriDesignSystem_55844a;
function Events({
  events
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--space-9) var(--page-margin) var(--space-6)",
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    index: 3
  }, "Experiences"), /*#__PURE__*/React.createElement(MetaLabel, null, "2025 \u2014 2026")), /*#__PURE__*/React.createElement(Display, {
    level: 2,
    tone: "blue"
  }, "Events"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: "var(--measure)",
      fontSize: "var(--body-lg)",
      lineHeight: "var(--body-leading)",
      color: "var(--text-muted)"
    }
  }, "Nights, workshops and talks. Most are small on purpose; a few are free.")), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "0 var(--page-margin) var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement(Rule, {
    weight: "heavy"
  }), events.map(e => {
    const past = e.status === "Past";
    return /*#__PURE__*/React.createElement("div", {
      key: e.title,
      style: {
        display: "grid",
        gridTemplateColumns: "140px 1fr 260px 120px",
        alignItems: "center",
        gap: "var(--space-5)",
        padding: "var(--space-5) 0",
        borderBottom: "1px solid var(--line)",
        opacity: past ? 0.5 : 1
      }
    }, /*#__PURE__*/React.createElement(MetaLabel, {
      tone: "strong"
    }, e.date), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: "var(--weight-black)",
        fontSize: 24,
        textTransform: "uppercase",
        letterSpacing: "var(--heading-tracking)",
        lineHeight: 1.05
      }
    }, e.title), /*#__PURE__*/React.createElement(MetaLabel, null, e.place), /*#__PURE__*/React.createElement("span", {
      style: {
        justifySelf: "end"
      }
    }, past ? /*#__PURE__*/React.createElement(Tag, {
      tone: "inset"
    }, "Past") : /*#__PURE__*/React.createElement(Tag, {
      tone: "blue"
    }, e.status)));
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--ink)",
      color: "var(--text-on-dark)",
      padding: "var(--section-y) var(--page-margin)",
      position: "relative",
      overflow: "hidden",
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(BirdField, {
    bird: "glide",
    tone: "ghost-paper",
    size: 480,
    assetBase: "../../assets",
    style: {
      position: "absolute",
      right: "-100px",
      bottom: "-120px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gap: "var(--space-5)",
      justifyItems: "start"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    tone: "onDark"
  }, "Mailing list"), /*#__PURE__*/React.createElement(Display, {
    level: 3,
    tone: "onDark"
  }, "Hear about the next one first"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    style: {
      color: "var(--paper)",
      borderColor: "var(--paper)"
    }
  }, "Join the list"))));
}
Object.assign(window, {
  Events
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-site/Events.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-site/Home.jsx
try { (() => {
const {
  Display,
  MetaLabel,
  Tag,
  Button,
  ProjectCard,
  SectionHeading,
  Rule,
  Card
} = window.TheBenAriDesignSystem_55844a;
const {
  BirdField,
  FlockMark
} = window.TheBenAriDesignSystem_55844a;
function Hero({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "var(--blue)",
      color: "var(--text-on-blue)",
      minHeight: 620,
      display: "grid",
      alignContent: "space-between",
      padding: "var(--space-8) var(--page-margin) var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement(BirdField, {
    bird: "climb",
    tone: "ghost-paper",
    size: 560,
    assetBase: "../../assets",
    style: {
      position: "absolute",
      right: "-90px",
      top: "-60px",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--space-6)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    tone: "onDark"
  }, "BenAri \u2014 AI & creative practice"), /*#__PURE__*/React.createElement(MetaLabel, {
    tone: "onDark"
  }, "London \xB7 Available 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gap: "var(--space-6)",
      maxWidth: 1100
    }
  }, /*#__PURE__*/React.createElement(Display, {
    level: 1,
    tone: "onDark"
  }, "AI, in", /*#__PURE__*/React.createElement("br", null), "public"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: "52ch",
      fontSize: "var(--body-lg)",
      lineHeight: "var(--body-leading)",
      color: "var(--text-on-dark-muted)"
    }
  }, "I build things with models and then put them in front of people \u2014 installations, live formats, tools, and the occasional print run. Six pieces of work below."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: () => onNavigate("work")
  }, "See the work"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    onClick: () => onNavigate("contact"),
    style: {
      color: "var(--paper)"
    }
  }, "Get in touch"))));
}
function Strands({
  onNavigate
}) {
  const strands = [{
    i: 1,
    k: "AI projects",
    d: "Models used as material: installations, tools, research you can run."
  }, {
    i: 2,
    k: "Experiences",
    d: "Live formats and events — rooms, nights, workshops, closing talks."
  }, {
    i: 3,
    k: "Creative",
    d: "Print, film and objects made with, or about, generative process."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) var(--page-margin)",
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement(Rule, {
    weight: "heavy"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--gutter)",
      paddingTop: "var(--space-6)"
    }
  }, strands.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.k,
    style: {
      display: "grid",
      gap: "var(--space-4)",
      alignContent: "start"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    index: s.i
  }, s.k), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--body)",
      lineHeight: "var(--body-leading)",
      textAlign: "justify"
    }
  }, s.d), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("work"),
    style: {
      background: "none",
      border: 0,
      padding: 0,
      cursor: "pointer",
      justifySelf: "start",
      fontFamily: "var(--font-body)",
      fontSize: "var(--label)",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "var(--label-tracking)",
      color: "var(--blue)"
    }
  }, "See work \u2192")))));
}
function Selected({
  projects,
  onOpen,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "0 var(--page-margin) var(--section-y)",
      background: "var(--paper)",
      display: "grid",
      gap: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: 4,
    label: "Selected",
    title: "Recent work"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-7) var(--gutter)"
    }
  }, projects.slice(0, 6).map((p, i) => /*#__PURE__*/React.createElement(ProjectCard, {
    key: p.slug,
    index: i + 1,
    title: p.title,
    category: p.category,
    year: p.year,
    onClick: () => onOpen(p.slug)
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => onNavigate("work"),
    style: {
      justifySelf: "start"
    }
  }, "All work"));
}
function Statement() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--blue)",
      color: "var(--text-on-blue)",
      padding: "var(--section-y) var(--page-margin)",
      display: "grid",
      gap: "var(--space-6)",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(BirdField, {
    bird: "glide",
    tone: "ghost-paper",
    size: 420,
    assetBase: "../../assets",
    style: {
      position: "absolute",
      left: "-70px",
      bottom: "-90px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    tone: "onDark"
  }, "05 \u2014 Approach"), /*#__PURE__*/React.createElement(Display, {
    level: 2,
    tone: "onDark",
    style: {
      maxWidth: "18ch"
    }
  }, "Make it, then show it to strangers"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--gutter)",
      maxWidth: 900
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "justify",
      fontSize: "var(--body)",
      lineHeight: "var(--body-leading)",
      color: "var(--paper-70)"
    }
  }, "Every project here got in front of an audience before it was finished. A room full of people is the only test that tells you whether an idea is interesting or merely clever."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "justify",
      fontSize: "var(--body)",
      lineHeight: "var(--body-leading)",
      color: "var(--paper-70)"
    }
  }, "The practice runs on the same loop each time: build the smallest version, run it live, write down what happened, and decide honestly whether it earns a second edition."))));
}
function Home({
  projects,
  onOpen,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, {
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement(Strands, {
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement(Selected, {
    projects: projects,
    onOpen: onOpen,
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement(Statement, null));
}
Object.assign(window, {
  Home,
  Hero,
  Strands,
  Selected,
  Statement
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-site/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-site/Project.jsx
try { (() => {
const {
  Display,
  MetaLabel,
  Tag,
  Rule,
  Button,
  Card,
  BirdField
} = window.TheBenAriDesignSystem_55844a;
function Project({
  project,
  projects,
  onOpen,
  onNavigate
}) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--blue)",
      color: "var(--text-on-blue)",
      padding: "var(--space-8) var(--page-margin) var(--space-7)",
      display: "grid",
      gap: "var(--space-6)",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(BirdField, {
    bird: "land",
    tone: "ghost-paper",
    size: 420,
    assetBase: "../../assets",
    style: {
      position: "absolute",
      right: "-60px",
      top: "-40px"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("work"),
    style: {
      background: "none",
      border: 0,
      padding: 0,
      cursor: "pointer",
      justifySelf: "start",
      fontFamily: "var(--font-body)",
      fontSize: "var(--label)",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "var(--label-tracking)",
      color: "var(--paper-70)"
    }
  }, "\u2190 All work"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(Display, {
    level: 2,
    tone: "onDark"
  }, project.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)"
    }
  }, project.category.map(c => /*#__PURE__*/React.createElement(Tag, {
    key: c,
    tone: "blue"
  }, c)), /*#__PURE__*/React.createElement(Tag, {
    tone: "inset",
    style: {
      background: "var(--paper-18)",
      color: "var(--paper)"
    }
  }, project.year)))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--space-7) var(--page-margin) var(--space-8)",
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "16 / 7",
      background: "var(--surface-inset)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, null, "Lead image \u2014 16:7")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      alignContent: "start"
    }
  }, [["Role", project.role], ["Client", project.client], ["Place", project.place], ["Year", project.year]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "grid",
      gap: "var(--space-2)",
      borderTop: "1px solid var(--line)",
      paddingTop: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, null, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--body)",
      lineHeight: "var(--body-leading)"
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--body-lg)",
      lineHeight: "var(--body-leading)",
      maxWidth: "var(--measure)",
      textWrap: "pretty"
    }
  }, project.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--gutter)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "justify",
      fontSize: "var(--body)",
      lineHeight: "var(--body-leading)",
      color: "var(--text-muted)"
    }
  }, "The first version ran for two nights on a borrowed projector. It broke twice, and both failures turned out to be more interesting than the working state, so they stayed in."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "justify",
      fontSize: "var(--body)",
      lineHeight: "var(--body-leading)",
      color: "var(--text-muted)"
    }
  }, "Everything shipped is documented: notes, the model card, and the code where it can be shared. Ask if you want the long version \u2014 it is longer than this page.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--gutter)"
    }
  }, ["Still 01", "Still 02"].map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      aspectRatio: "4 / 3",
      background: "var(--surface-inset)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, null, s))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "0 var(--page-margin) var(--section-y)",
      display: "grid",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(Rule, {
    weight: "heavy"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, null, "Next"), /*#__PURE__*/React.createElement(Display, {
    level: 3,
    as: "div"
  }, next.title)), /*#__PURE__*/React.createElement(Button, {
    onClick: () => onOpen(next.slug)
  }, "Next project \u2192"))));
}
Object.assign(window, {
  Project
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-site/Project.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-site/Work.jsx
try { (() => {
const {
  Display,
  MetaLabel,
  Tag,
  ProjectCard,
  Rule,
  Button
} = window.TheBenAriDesignSystem_55844a;
function Work({
  projects,
  onOpen
}) {
  const [filter, setFilter] = React.useState("All");
  const filters = ["All", "AI", "Event", "Creative"];
  const shown = filter === "All" ? projects : projects.filter(p => p.category.some(c => c.startsWith(filter)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--space-9) var(--page-margin) var(--space-6)",
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(MetaLabel, {
    index: 2
  }, "Work"), /*#__PURE__*/React.createElement(MetaLabel, null, String(shown.length).padStart(2, "0"), " / ", String(projects.length).padStart(2, "0"))), /*#__PURE__*/React.createElement(Display, {
    level: 2
  }, "All work"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      flexWrap: "wrap"
    }
  }, filters.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    onClick: () => setFilter(f),
    style: {
      border: 0,
      padding: 0,
      background: "none",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: filter === f ? "solid" : "outline"
  }, f)))), /*#__PURE__*/React.createElement(Rule, {
    weight: "heavy"
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "0 var(--page-margin) var(--section-y)",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-7) var(--gutter)"
    }
  }, shown.map((p, i) => /*#__PURE__*/React.createElement(ProjectCard, {
    key: p.slug,
    index: i + 1,
    title: p.title,
    category: p.category,
    year: p.year,
    onClick: () => onOpen(p.slug)
  }))));
}
Object.assign(window, {
  Work
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-site/Work.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-site/data.js
try { (() => {
window.TBA_DATA = {
  nav: [{
    id: "home",
    label: "Index"
  }, {
    id: "work",
    label: "Work"
  }, {
    id: "events",
    label: "Events"
  }, {
    id: "contact",
    label: "Contact"
  }],
  projects: [{
    slug: "latent-atlas",
    title: "Latent Atlas",
    category: ["AI", "Installation"],
    year: "2025",
    blurb: "A room-scale map of a diffusion model's latent space. Visitors walk a projection and steer the render with their own movement.",
    role: "Concept, model work, spatial design",
    client: "Somerset House Studios",
    place: "London"
  }, {
    slug: "night-format",
    title: "Night Format",
    category: ["Event"],
    year: "2025",
    blurb: "A recurring late-night format pairing generative visuals with live improvisation. Four editions, roughly 300 people a night.",
    role: "Format, curation, production",
    client: "Self-initiated",
    place: "London"
  }, {
    slug: "small-models",
    title: "Small Models",
    category: ["AI", "Writing"],
    year: "2024",
    blurb: "An essay series and toolkit on running tiny local models for creative work, with runnable notebooks for each piece.",
    role: "Research, writing, code",
    client: "Self-initiated",
    place: "Remote"
  }, {
    slug: "paper-birds",
    title: "Paper Birds",
    category: ["Creative"],
    year: "2024",
    blurb: "A print run of forty risograph posters generated from a hand-trained silhouette model, cut and folded by hand.",
    role: "Design, print production",
    client: "Self-initiated",
    place: "London"
  }, {
    slug: "field-notes",
    title: "Field Notes",
    category: ["AI", "Product"],
    year: "2024",
    blurb: "A research assistant for two-day workshops: captures the room, clusters what was said, and returns a readable brief by morning.",
    role: "Product design, prototyping",
    client: "Confidential",
    place: "Berlin"
  }, {
    slug: "long-exposure",
    title: "Long Exposure",
    category: ["Creative", "Film"],
    year: "2023",
    blurb: "A twelve-minute film assembled from a year of one-frame-a-day captures, scored to a generated ambient track.",
    role: "Direction, edit",
    client: "Self-initiated",
    place: "London"
  }],
  events: [{
    date: "12 Mar 2026",
    title: "Night Format 05",
    place: "Corsica Studios, London",
    status: "Tickets"
  }, {
    date: "28 Apr 2026",
    title: "Small Models, live workshop",
    place: "Somerset House, London",
    status: "Waitlist"
  }, {
    date: "09 May 2026",
    title: "Latent Atlas — closing talk",
    place: "Rotterdam",
    status: "Free"
  }, {
    date: "14 Nov 2025",
    title: "Night Format 04",
    place: "Corsica Studios, London",
    status: "Past"
  }, {
    date: "02 Oct 2025",
    title: "Field Notes at Slush side-stage",
    place: "Helsinki",
    status: "Past"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-site/data.js", error: String((e && e.message) || e) }); }

__ds_ns.BirdField = __ds_scope.BirdField;

__ds_ns.FlockMark = __ds_scope.FlockMark;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Display = __ds_scope.Display;

__ds_ns.MetaLabel = __ds_scope.MetaLabel;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.Rule = __ds_scope.Rule;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
