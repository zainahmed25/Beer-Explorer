import { LightningElement, api } from 'lwc';

export default class CartItem extends LightningElement {
    @api item;

    handleDelete(){
        const deleteEve = new CustomEvent(
            'delete',
            {
                detail : this.item.Id
            }
        );
        this.dispatchEvent(deleteEve);
    }
}