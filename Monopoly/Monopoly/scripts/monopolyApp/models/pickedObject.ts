module MonopolyApp.Viewmodels {
    export enum PickedObjectType { None, BoardField, AddHouse, RemoveHouse };

    // represents an object that has been picked from the scene either via click/tap or via swipe
    export class PickedObject {
        pickedObjectType: PickedObjectType;
        pickedMesh: BABYLON.AbstractMesh;
        position: number; // board field index of the button or the field itself; valid for add/remove house buttons and board fields
    }
}