import 'brace/mode/java';

export class CustomHighlightRules extends window.ace.acequire("ace/mode/text_highlight_rules").TextHighlightRules {
    constructor() {
        super();
        this.$rules = {
        start: [{
            include: "#procedure-definition"
        }, {
            include: "#statements"
        }],
        "#procedure-definition": [{
            token: [
                "keyword.other.abl",
                "meta.procedure.abl",
                "entity.name.function.abl"
            ],
            regex: "/\\b(proce|proced|procedu|procedur|procedure)\\b(\\s+)((?:[\\w-]*)?)/",
            caseInsensitive: true,
            push: [{
                token: "meta.procedure.abl",
                regex: "/(?=\\.)/",
                next: "pop"
            }, {
                token: "meta.procedure.body.abl",
                regex: "/:/",
                push: [{
                    token: "keyword.other.abl",
                    regex: "/end\\s*procedure|end/",
                    caseInsensitive: true,
                    next: "pop"
                }, {
                    include: "#code-block"
                }, {
                    defaultToken: "meta.procedure.body.abl"
                }]
            }, {
                defaultToken: "meta.procedure.abl"
            }]
        }],
        "#statements": [{
            include: "#singlequotedstring"
        }, {
            include: "#doublequotedstring"
        }, {
            include: "#singlelinecomment"
        }, {
            include: "#multilinecomment"
        }, {
            include: "#declarations"
        }, {
            include: "#numeric"
        }, {
            include: "#constant"
        }, {
            include: "#operator"
        }, {
            include: "#analyze-suspend-resume"
        }, {
            include: "#global-scoped-define"
        }, {
            token: "storage.type.function.abl",
            regex: "/\\&[\\w-]*|{\\&[\\w-]*}|(?:&window-system|&text-height|&line-number|&batch-mode|&file-name|&undefine|&sequence|&message|defined|&elseif|&scoped|&global|&opsys|&endif|&else|&scop|&then|&glob|&if)/",
            caseInsensitive: true
        }, {
            include: "#primitive-type"
        }, {
            include: "#function-call"
        }, {
            include: "#code-block"
        }, {
            include: "#keywords"
        }, {
            include: "#variable-name"
        }, {
            include: "#punctuation-semicolon"
        }],
        "#declarations": [{
            include: "#define"
        }],
        "#code-block": [{
            include: "#singlelinecomment"
        }, {
            include: "#multilinecomment"
        }, {
            include: "#singlequotedstring"
        }, {
            include: "#doublequotedstring"
        }, {
            include: "#numeric"
        }, {
            include: "#constant"
        }, {
            include: "#operator"
        }, {
            include: "#include-file"
        }, {
            include: "#define"
        }, {
            include: "#do-block"
        }, {
            include: "#keywords"
        }, {
            include: "#variable-name"
        }, {
            include: "#function-call"
        }],
        "#define": [{
            token: ["keyword.other.abl", "meta.define.abl"],
            regex: "/\\b(def|define)(\\s+)/",
            caseInsensitive: true,
            push: [{
                token: "meta.define.abl",
                regex: "/(?=\\.)/",
                next: "pop"
            }, {
                token: "keyword.other.abl",
                regex: "/\\b(?:new|shared|var|vari|varia|variab|variabl|variable|private|protected|public|static|serializable|non-serializable)\\b/",
                caseInsensitive: true,
                push: [{
                    token: "meta.define.variable.abl",
                    regex: "/(?=\\.)/",
                    next: "pop"
                }, {
                    include: "#singlequotedstring"
                }, {
                    include: "#doublequotedstring"
                }, {
                    include: "#primitive-type"
                }, {
                    include: "#numeric"
                }, {
                    include: "#constant"
                }, {
                    include: "#keywords"
                }, {
                    include: "#variable-name"
                }, {
                    defaultToken: "meta.define.variable.abl"
                }],
                comment: "https://documentation.progress.com/output/ua/OpenEdge_latest/index.html#page/dvref%2Fdefine-variable-statement.html%23"
            }, {
                token: [
                    "keyword.other.abl",
                    "meta.define.parameter.abl"
                ],
                regex: "/(?<=^|\\s)(input|output|input-output|return)(?=\\s)([^\\.]*)/",
                caseInsensitive: true,
                comment: "https://documentation.progress.com/output/ua/OpenEdge_latest/index.html#page/dvref%2Fdefine-variable-statement.html%23"
            }, {
                token: [
                    "keyword.other.abl",
                    "meta.define.stream.abl"
                ],
                regex: "/\\b(stream)\\b([^\\.]*)/",
                caseInsensitive: true,
                comment: "https://documentation.progress.com/output/ua/OpenEdge_latest/index.html#page/dvref%2Fdefine-stream-statement.html%23"
            }, {
                include: "#singlequotedstring"
            }, {
                include: "#doublequotedstring"
            }, {
                include: "#primitive-type"
            }, {
                include: "#numeric"
            }, {
                include: "#constant"
            }, {
                include: "#keywords"
            }, {
                include: "#singlelinecomment"
            }, {
                include: "#multilinecomment"
            }, {
                defaultToken: "meta.define.abl"
            }],
            comment: "Let's assume define can't have '.' inside"
        }],
        "#do-block": [{
            token: "keyword.other.abl",
            regex: "/\\bdo\\b/",
            caseInsensitive: true,
            push: [{
                token: "meta.do.abl",
                regex: "/(?=\\.)/",
                next: "pop"
            }, {
                token: "keyword.other.abl",
                regex: "/\\bwhile\\b/",
                caseInsensitive: true,
                push: [{
                    token: "meta.do.while.abl",
                    regex: "/(?=:)/",
                    next: "pop"
                }, {
                    include: "#statements"
                }, {
                    defaultToken: "meta.do.while.abl"
                }]
            }, {
                include: "#statements"
            }, {
                token: "meta.do.body.abl",
                regex: "/:/",
                push: [{
                    token: "keyword.other.abl",
                    regex: "/end\\s*do|end/",
                    caseInsensitive: true,
                    next: "pop"
                }, {
                    include: "#code-block"
                }, {
                    defaultToken: "meta.do.body.abl"
                }]
            }, {
                defaultToken: "meta.do.abl"
            }]
        }],
        "#analyze-suspend-resume": [{
            token: "comment.preprocessor.analyze-suspend.abl",
            regex: "/(?:\\&analyze-suspend|\\&analyze-resume)\\s*/",
            caseInsensitive: true,
            push: [{
                token: "comment.preprocessor.analyze-suspend.abl",
                regex: "/(?=(?:\\/\\/|\\/\\*))|$/",
                next: "pop"
            }, {
                defaultToken: "comment.preprocessor.analyze-suspend.abl"
            }]
        }],
        "#global-scoped-define": [{
            token: [
                "keyword.other.abl",
                "meta.preprocessor.define.abl",
                "entity.name.function.preprocessor.abl",
                "meta.preprocessor.define.abl"
            ],
            regex: "/(\\&scoped-define|\\&global-define)(\\s*)([\\.\\w\\\\\\/-]*)(\\s*)/",
            caseInsensitive: true,
            push: [{
                token: "meta.preprocessor.define.abl",
                regex: "/(?=(?:\\/\\/|\\/\\*))|$/",
                next: "pop"
            }, {
                include: "#singlequotedstring"
            }, {
                include: "#doublequotedstring"
            }, {
                defaultToken: "meta.preprocessor.define.abl"
            }],
            comment: "https://documentation.progress.com/output/ua/OpenEdge_latest/index.html#page/dvref%2F%257B-%257D-include-file-reference.html%23"
        }],
        "#function-call": [{
            token: "support.function.abl",
            regex: "/(?<=\\.|:)(?:\\w|-)+/"
        }],
        "#variable-name": [{
            token: "variable.other.abl",
            regex: "/(?<=^|\\s)(?:\\w|-)+(?=\\s*)/"
        }],
        "#parameter-name": [{
            token: "variable.parameter.abl",
            regex: "/(?<=^|\\s)(?:\\w|-)+(?=\\s)/"
        }],
        "#include-file": [{
            token: ["punctuation.section.abl", "meta.include.abl"],
            regex: "/({)(\\s*)/",
            push: [{
                token: [
                    "meta.include.abl",
                    "punctuation.section.abl"
                ],
                regex: "/(\\s*)(})/",
                next: "pop"
            }, {
                token: "string.unquoted.filename.abl",
                regex: "/[\\.\\w\\\\\\/-]*\\s*/"
            }, {
                defaultToken: "meta.include.abl"
            }],
            comment: "https://documentation.progress.com/output/ua/OpenEdge_latest/index.html#page/dvref%2F%257B-%257D-include-file-reference.html%23"
        }],
        "#argument-reference": [{
            todo: {
                comment: "https://documentation.progress.com/output/ua/OpenEdge_latest/index.html#page/dvref%2F%257B-%257D-argument-reference.html%23"
            },
            comment: "https://documentation.progress.com/output/ua/OpenEdge_latest/index.html#page/dvref%2F%257B-%257D-argument-reference.html%23"
        }],
        "#singlelinecomment": [{
            token: "comment.source.abl",
            regex: "/\\/\\/.*$/"
        }],
        "#multilinecomment": [{
            token: "comment.block.source.abl",
            regex: "/(?<!=)\\/\\*/",
            push: [{
                token: "comment.block.source.abl",
                regex: "/\\*\\//",
                next: "pop"
            }, {
                include: "#multilinecomment"
            }, {
                defaultToken: "comment.block.source.abl"
            }]
        }],
        "#singlequotedstring": [{
            token: "punctuation.definition.string.begin.abl",
            regex: "/'/",
            push: [{
                token: "punctuation.definition.string.end.abl",
                regex: "/'/",
                next: "pop"
            }, {
                token: "constant.character.escape.abl",
                regex: "/~./"
            }, {
                defaultToken: "string.single.complex.abl"
            }]
        }],
        "#doublequotedstring": [{
            token: "punctuation.definition.string.begin.abl",
            regex: "/"/"",
            push: [{
                token: "punctuation.definition.string.end.abl",
                regex: "/"/"",
                next: "pop"
            }, {
                token: "constant.character.escape.abl",
                regex: "/~./"
            }, {
                defaultToken: "string.double.complex.abl"
            }]
        }],
        "#primitive-type": [{
            token: "storage.type.abl",
            regex: "/(?<=^|\\s)(?:blob|character|characte|charact|charac|chara|char|clob|com-handle|date|datetime|datetime-tz|decimal|decima|decim|deci|dec|handle|int64|integer|intege|integ|inte|int|logical|logica|logic|logi|log|longchar|longcha|longch|memptr|raw|recid|rowid|widget-handle)(?![=\\w-])/",
            caseInsensitive: true,
            comment: "https://documentation.progress.com/output/ua/OpenEdge_latest/index.html#page/dvref/data-types.html"
        }],
        "#numeric": [{
            token: "constant.numeric.source.abl",
            regex: "/(?<![\\w-])(?:0(?:x|X)[0-9a-fA-F]+|[0-9]+(?:\\.[0-9]+)?)/"
        }],
        "#constant": [{
            token: "constant.language.source.abl",
            regex: "/(?<=^|\\s)(?:true|false|yes|no)(?=\\s|\\.)/",
            caseInsensitive: true
        }],
        "#punctuation-semicolon": [{
            token: "punctuation.terminator.abl",
            regex: "/\\./"
        }],
        "#operator": [{
            include: "#operator1"
        }, {
            include: "#operator2"
        }],
        "#operator1": [{
            token: "keyword.operator.source.abl",
            regex: "/(?<=^|\\s)(?:or|and|not|is|eq|ge|ne|le|lt|gt)(?=\\s|\\.)/",
            caseInsensitive: true
        }],
        "#operator2": [{
            token: "keyword.operator.source.abl",
            regex: "/<=|<>|>=|=|\\+| - |\\/|<|>|,/",
            caseInsensitive: true
        }]
    }
    }
}

export default class CustomOpenEdgeMode extends window.ace.acequire('ace/mode/java').Mode {
    constructor() {
        super();
        this.HighlightRules = CustomHighlightRules;
    }
}