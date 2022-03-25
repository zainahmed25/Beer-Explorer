import { LightningElement, api } from 'lwc';

export default class BeerTile extends LightningElement {
    @api beerRecord;

    handleAddToCart(){
        const addToCart = new CustomEvent(
            'cart',
            {
                detail : this.beerRecord.Id
            }
        );
        this.dispatchEvent(addToCart);
    }
}