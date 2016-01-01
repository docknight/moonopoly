module Model {
    export enum AssetGroup { None, First, Second, Third, Fourth, Fifth, Sixth, Seventh, Eighth, Utility, Railway };

    export class Asset {
        private _unowned: boolean;
        private _owner: string;
        private _houses: number;
        private _uncommittedHouses: number;
        private _hotel: boolean;
        private _uncommittedHotel: boolean;
        private _mortgage: boolean;

        constructor() {
            this._unowned = true;
            this._mortgage = false;
            this._houses = 0;
            this._uncommittedHouses = 0;
            this._hotel = false;
            this._uncommittedHotel = undefined;
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
            if (this.hotel) {
                return 0;
            }
            return this._houses + this._uncommittedHouses;
        }

        get hotel(): boolean {
            if (this._uncommittedHotel !== undefined) {
                return this._uncommittedHotel;
            }
            return this._hotel;
        }

        get mortgage(): boolean {
            return this._mortgage;
        }

        // add a house in a preview mode
        addHouse() {
            this._uncommittedHouses++;
        }

        // add a hotel in a preview mode
        addHotel() {
            this._uncommittedHotel = true;
        }

        // add a house in a preview mode
        removeHouse() {
            this._uncommittedHouses--;
        }

        // add a hotel in a preview mode
        removeHotel() {
            this._uncommittedHotel = false;
            this._uncommittedHouses = 4;
        }

        commitHouseOrHotel() {
            this._houses += this._uncommittedHouses;
            this._uncommittedHouses = 0;
            if (this._uncommittedHotel !== undefined) {
                this.hotel = this._uncommittedHotel;
            }
            this._uncommittedHotel = undefined;
            if (this.hotel) {
                this.houses = 0;
            }
        }

        rollbackHouseOrHotel() {
            this._uncommittedHouses = 0;
            this._uncommittedHotel = undefined;
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