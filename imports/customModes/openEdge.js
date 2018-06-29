import 'brace/mode/abap';

export class CustomHighlightRules extends window.ace.acequire("ace/mode/text_highlight_rules").TextHighlightRules {
    constructor() {
        super();
        this.$rules = {
            start: [{
                token: "comment.block.source.abl",
                regex: /\/\*/,
                push: [{
                    token: "comment.block.source.abl",
                    regex: /\*\/(?![^\/]*?\*\/)/,
                    next: "pop"
                }, {
                    defaultToken: "comment.block.source.abl"
                }]
            }, {
                token: "string.single.source.abl",
                regex: /'(?:'|.)*?'/,
                comment: "Single quoted string"
            }, {
                token: "string.double.source.abl",
                regex: /""[a-zA-Z0-9_\.\-]+""/
            }, {
                token: "string.double.complex.abl",
                regex: /"(?!"[a-zA-Z]+)|""[a-zA-Z]+/,
                push: [{
                    token: "string.double.complex.abl",
                    regex: /"(?!")/,
                    next: "pop"
                }, {
                    token: "constant.character.escape.abl",
                    regex: /~(?:x[\da-fA-F]{2}|[0-2][0-7]{,2}|3[0-6][0-7]|37[0-7]?|[4-7][0-7]?|.)|""/
                }, {
                    defaultToken: "string.double.complex.abl"
                }]
            }, {
                token: "constant.numeric.source.abl",
                regex: "(?<!\\w)(?:0(?:x|X)[0-9a-fA-F]+|[0-9]+(?:\\.[0-9]+)?)",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<!\\w)((0(x|X)[0-9a-fA-F]+)|([0-9]+(\\.[0-9]+)?))"
            }, {
                token: "constant.language.source.abl",
                regex: /\b(?:true|false|yes|no(?!-))\b/,
                caseInsensitive: true
            }, {
                token: "keyword.operator.source.abl",
                regex: /\b(?:or|and|not|is)\b|(?:=|\+| - |\/|<|>|,)/,
                caseInsensitive: true
            }, {
                token: "keyword.option.source.abl",
                regex: /\b(?:no-undo|no-box|no-labels|no-lock|no-error|format|colon|label|initial|side-labels|width|primary|use-index)\b|@/,
                caseInsensitive: true
            }, {
                token: "keyword.statement.source.abl",
                regex: /\b(?:enable|disable|display|delete|create|update|assign|import(?: unformatted)?|input\s+(?:from|close)|with|skip)\b/,
                caseInsensitive: true
            }, {
                token: "keyword.type.source.abl",
                regex: /\b(?:as|for(?!\s+(?:each|first|last)))\b/,
                caseInsensitive: true
            }, {
                token: [
                    "keyword.type.source.abl",
                    "text",
                    "storage.type.source.abl"
                ],
                regex: /\b(like)(\s+)([a-zA-Z0-9_\.-]+)/,
                caseInsensitive: true
            }, {
                token: "keyword.control.source.abl",
                regex: "\\b(?:if|available|down|where|else(?: if)?|for\\s+(?:each|first|last)|do while|repeat(?:\\s+while)?|find(?: first|last)?|then(?: do(?: transaction)?)?|next|page|quit)\\b|(?<!-)\\bend\\b(?!\\s+procedure)",
                caseInsensitive: true,
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?i)(\\b(if|available|down|where|else( if)?|for\\s+(each|first|last)|do while|repeat(\\s+while)?|find( first|last)?|then( do( transaction)?)?|next|page|quit)\\b|(?<!-)(\\bend\\b(?!\\s+procedure)))"
            }, {
                token: "storage.type.define.abl",
                regex: /\b(?:define\s+(?:(?:(?:new\s+)?shared\s+)?(?:variable|stream|buffer)|(?:input|input-output|output)\s+parameter|temp-table|query)|form)\b/,
                caseInsensitive: true
            }, {
                token: "storage.type.source.abl",
                regex: "\\b(?<!&)(?:character|(?<!-)handle|dataset-handle|dataset|field|(?<!-)index|logical|integer|stream|frame [a-z]+)(?!\\s*\\()\\b",
                caseInsensitive: true,
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?i)\\b(?<!&)(character|(?<!-)handle|dataset-handle|dataset|field|(?<!-)index|logical|integer|stream|frame [a-z]+)(?!\\s*\\()\\b"
            }, {
                token: "storage.type.function.abl",
                regex: /end procedure/,
                caseInsensitive: true
            }, {
                token: "support.function.source.abl",
                regex: /\b[a-z][a-z0-9_-]*?\b\s*(?=\s*\(.*?\))/,
                caseInsensitive: true
            }, {
                token: [
                    "keyword.statement.source.abl",
                    "support.function.abl",
                    "support.function.source.abl",
                    "support.function.abl"
                ],
                regex: /\b(run)( )([a-z][a-z0-9_-]*?)\b((?:\s*\(.*?\))?)/,
                caseInsensitive: true
            }, {
                token: [
                    "storage.type.function.abl",
                    "meta.function.source.abl",
                    "entity.name.function.abl",
                    "meta.function.source.abl"
                ],
                regex: /(procedure)(\s+)([a-z0-9_-]+)(:)/,
                caseInsensitive: true
            }, {
                token: "support.function.source.abl",
                regex: /\{[a-z0-9_\.\/-]+/,
                caseInsensitive: true
            }, {
                token: "support.function.source.abl",
                regex: /\}/

            }, {
                token: "constant.numeric.source.abl",
                regex: "(?<!\\w)(?:0(?:x|X)[0-9a-fA-F]+|[0-9]+(?:\\.[0-9]+)?)",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<!\\w)((0(x|X)[0-9a-fA-F]+)|([0-9]+(\\.[0-9]+)?))"
            }, {
                token: "constant.language.source.abl",
                regex: /\b(?:true|false|yes|no(?!-))\b/,
                caseInsensitive: true
            }, {
                token: "keyword.operator.source.abl",
                regex: /\b(?:or|and|not|is)\b|(?:=|\+| - |\/|<|>|,)/,
                caseInsensitive: true
            }, {
                token: "keyword.option.source.abl",
                regex: /\b(?:no-undo|no-box|no-labels|no-lock|no-error|format|colon|label|initial|side-labels|width|primary|use-index)\b|@/,
                caseInsensitive: true
            }, {
                token: "keyword.statement.source.abl",
                regex: /\b(?:enable|disable|display|delete|create|update|assign|import(?: unformatted)?|input\s+(?:from|close)|with|skip)\b/,
                caseInsensitive: true
            }, {
                token: "keyword.type.source.abl",
                regex: /\b(?:as|for(?!\s+(?:each|first|last)))\b/,
                caseInsensitive: true
            }, {
                token: [
                    "keyword.type.source.abl",
                    "text",
                    "storage.type.source.abl"
                ],
                regex: /\b(like)(\s+)([a-zA-Z0-9_\.-]+)/,
                caseInsensitive: true
            }, {
                token: "keyword.control.source.abl",
                regex: "\\b(?:if|available|down|where|else(?: if)?|for\\s+(?:each|first|last)|do while|repeat(?:\\s+while)?|find(?: first|last)?|then(?: do(?: transaction)?)?|next|page|quit)\\b|(?<!-)\\bend\\b(?!\\s+procedure)",
                caseInsensitive: true,
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?i)(\\b(if|available|down|where|else( if)?|for\\s+(each|first|last)|do while|repeat(\\s+while)?|find( first|last)?|then( do( transaction)?)?|next|page|quit)\\b|(?<!-)(\\bend\\b(?!\\s+procedure)))"
            }, {
                token: "storage.type.define.abl",
                regex: /\b((?:def(ine)*\s+(?:(?:(?:new\s+)?shared\s+)?(?:var(iable)*|stream|buffer))|(?:input|input-output|output)\s+param(eter)*|temp-table|query)|form)\b/,
                caseInsensitive: true
            }, {
                token: "storage.type.source.abl",
                regex: /\b(?<!&)(?:char(?:acter)*|(?<!-)handle|dataset-handle|dataset|field|(?<!-)index|log(?:ical)*|int(?:eger)*|dec(?:imal)*|date|stream|frame [a-z]+)(?!\s*\()\b/,
                caseInsensitive: true
            }, {
                token: "storage.type.function.abl",
                regex: /end\s+(procedure)*/,
                caseInsensitive: true
            }, {
                token: "support.function.source.abl",
                regex: /\b[a-z][a-z0-9_-]*?\b\s*(?=\s*\(.*?\))/,
                caseInsensitive: true
            }, {
                token: [
                    "keyword.statement.source.abl",
                    "support.function.abl",
                    "support.function.source.abl",
                    "support.function.abl"
                ],
                regex: /\b(run)( )([a-z][a-z0-9_-]*?)\b((?:\s*\(.*?\))?)/,
                caseInsensitive: true
            }, {
                token: [
                    "storage.type.function.abl",
                    "meta.function.source.abl",
                    "entity.name.function.abl",
                    "meta.function.source.abl"
                ],
                regex: /(proc(?:edure)*|func(?:tion)*)(\s+)([a-z0-9_-]+)(:)/,
                caseInsensitive: true
            }, {
                token: "support.function.source.abl",
                regex: /\{[a-z0-9_\.\/-]+/,
                caseInsensitive: true
            }, {
                token: "support.function.source.abl",
                regex: /\}/
            }]
        }

        this.normalizeRules();
    }
}

export default class CustomOpenEdgeMode extends window.ace.acequire('ace/mode/abap').Mode {
    constructor() {
        super();
        this.HighlightRules = CustomHighlightRules;

    }
}
