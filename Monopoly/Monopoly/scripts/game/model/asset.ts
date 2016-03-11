module Model {
    export enum AssetGroup { None, First, Second, Third, Fourth, Fifth, Sixth, Seventh, Eighth, Utility, Railway };

    export class Asset {
        private _unowned: boolean;
        private _owner: string;
        private _houses: number;
        private _uncommittedHouses: number; // relative quantity of bought/sold houses; (negative if more houses have been sold than bought)
        private _hotel: boolean;
        private _uncommittedHotel: boolean; // true, if a hotel is being added; false, if it is being removed; undefined, if there are no changes 
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
        color: string;
        price: number;
        group: AssetGroup;
        priceRent: number[];
        priceRentHouse: number[];
        priceRentHotel: number;
        priceHouse: number;
        priceHotel: number;
        valueMortgage: number;
        priceMultiplierUtility: number[];

        get owner(): string {
            return this._owner;
        }

        get unowned(): boolean {
            return this._unowned;
        }

        get houses(): number {
            if (this.hotel || this._uncommittedHotel) {
                return 0;
            } else if (this._uncommittedHotel === false) {
                return 4 + this._uncommittedHouses;
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

        get isUtility(): boolean {
            return this.group === Model.AssetGroup.Utility;
        }

        get isRailway(): boolean {
            return this.group === Model.AssetGroup.Railway;
        }

        // add a house in a preview mode;
        addHouse() {
            this._uncommittedHouses++;
        }

        // add a hotel in a preview mode;
        addHotel() {
            this._uncommittedHotel = this._uncommittedHotel === false ? undefined : true;
        }

        // remove a house in a preview mode
        removeHouse() {
            this._uncommittedHouses--;
        }

        // remove a hotel in a preview mode
        removeHotel() {
            this._uncommittedHotel = this._uncommittedHotel ? undefined : false;
            //this._uncommittedHouses = 4;
        }

        commitHouseOrHotel() {
            if (this._uncommittedHotel !== undefined) {
                this._hotel = this._uncommittedHotel;
                if (this._uncommittedHotel === false) {
                    this._houses = 4;
                }
            }
            this._houses += this._uncommittedHouses;
            this._uncommittedHouses = 0;
            this._uncommittedHotel = undefined;
            if (this.hotel) {
                this._houses = 0;
            }
        }

        rollbackHouseOrHotel() {
            this._uncommittedHouses = 0;
            this._uncommittedHotel = undefined;
        }

        // gets the price to pay for all the uncommitted amenities of the asset (can be negative if the player is selling houses/hotel);
        uncommittedPrice(): number {
            var price = 0;
            if (this._uncommittedHotel) {
                price += this.priceHotel;
            } else if (this._uncommittedHotel === false) {
                price -= this.priceHotel / 2;
            }
            if (this._uncommittedHouses) {
                var priceHouses = this._uncommittedHouses * this.priceHouse;
                if (this._uncommittedHouses < 0) {
                    priceHouses = Math.floor(priceHouses / 2);
                }
                price += priceHouses;
            }
            return price;
        }

        hasUncommittedUpgrades(): boolean {
            return this._uncommittedHotel || this._uncommittedHotel === false || (this._uncommittedHouses && (this._uncommittedHouses > 0 || this._uncommittedHouses < 0));
        }

        // returns hotel price, taking into account that the hotel that has just been sold (at a half price) can be bought back at the same price, since the sell has not been
        // committed yet
        // the 'selling' parameter determines whether the hotel is being sold or bought
        getPriceForHotelDuringManage(selling: boolean): number {
            if (!selling) {
                if (this._uncommittedHotel === false) {
                    return this.priceHotel / 2;
                }
                return this.priceHotel;
            } else {
                if (this._uncommittedHotel) {
                    return this.priceHotel;
                }
                return this.priceHotel / 2;
            }
        }

        // returns house price, taking into account that the house that has just been sold (at a half price) can be bought back at the same price, since the sell has not been
        // committed yet
        // the 'selling' parameter determines whether the house is being sold or bought
        getPriceForHouseDuringManage(selling: boolean): number {
            if (!selling) {
                if (this._uncommittedHouses === undefined || this._uncommittedHouses < 0) {
                    return this.priceHouse / 2;
                }
                return this.priceHouse;
            } else {
                if (this._uncommittedHouses && this._uncommittedHouses > 0) {
                    return this.priceHouse;
                }
                return this.priceHouse / 2;
            }
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