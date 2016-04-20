﻿module Model {
    // defines data for a single tutorial stage (or step)
    export class TutorialData {
        constructor() {
        }
        messageDialogVisible: boolean;
        messageDialogText: string;
        messageDialogTop: number; // top position of the dialog
        messagePaddingTop: number; // top position of the text, relative to the dialog
        disableClickForward: boolean; // whether forwarding to the next step via mouse click is disabled;
        customFunction: (tutorialService: Interfaces.ITutorialService, stepData: TutorialData, customData: any) => any;
        executeOnAction: (action: string, tutorialService: Interfaces.ITutorialService, stepData: TutorialData) => any;
    }
} 