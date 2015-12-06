module Model {
    export enum AssetGroup { None, First, Second, Third, Fourth, Fifth, Sixth, Seventh, Eighth, Utility, Railway };

    export class Asset {
        private _unowned: boolean;
        constructor() {
            this._unowned = true;
        }

        name: string;
        price: number;
        group: AssetGroup;
        priceRent: number;
        priceRentGroup: number;
        priceRent1House: number;
        priceRent2House: number;
        priceRent3House: number;
        priceRent4House: number;
        priceRentHotel: number;
        priceHouse: number;
        priceHotel: number;
        priceMortgage: number;
        price1Railway: number;
        price2Railway: number;
        price3Railway: number;
        price4Railway: number;
        priceMultiplier1Utility: number;
        priceMultiplier2Utility: number;
        owner: string;

        get unowned(): boolean {
            return this._unowned;
        }

        setOwner(ownerName: string) {
            if (this._unowned) {
                this.owner = ownerName;
                this._unowned = false;
            }
        }
    }
} 