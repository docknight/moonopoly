module Model {
    export enum AssetGroup { None, First, Second, Third, Fourth, Fifth, Sixth, Seventh, Eighth, Utility, Railway };

    export class Asset {
        private _unowned: boolean;
        private _owner: string;
        private _houses: number;
        private _hotel: boolean;
        private _mortgage: boolean;

        constructor() {
            this._unowned = true;
            this._mortgage = false;
            this._houses = 0;
            this._hotel = false;
            this.priceRent = [];
            this.priceRentHouse = [];
            this.priceMultiplierUtility = [];
        }

        name: string;
        price: number;
        group: AssetGroup;
        priceRent: number[];
        priceRentHouse: number[];
        priceRentHotel: number;
        priceHouse: number;
        priceHotel: number;
        priceMortgage: number;
        priceMultiplierUtility: number[];

        get owner(): string {
            return this._owner;
        }

        get unowned(): boolean {
            return this._unowned;
        }

        get houses(): number {
            return this._houses;
        }

        get hotel(): boolean {
            return this._hotel;
        }

        get mortgage(): boolean {
            return this._mortgage;
        }

        placeHouse() {
            this._houses++;
        }

        placeHotel() {
            this._houses = 0;
            this._hotel = true;
        }

        putUnderMortgage() {
            this._mortgage = true;
        }

        releaseMortgage() {
            this._mortgage = false;
        }

        setOwner(ownerName: string) {
            if (this._unowned) {
                this._owner = ownerName;
                this._unowned = false;
            }
        }
    }
} 