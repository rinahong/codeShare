import 'brace/mode/java';

export default class CustomOpenEdgeMode extends window.ace.acequire('ace/mode/java').Mode {
    constructor() {
        super();
        this.HighlightRules = CustomHighlightRules;
    }
}