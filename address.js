import { LightningElement, api } from 'lwc';

export default class AddressComponent extends LightningElement {
    @api address;

    handleSelect(){
        const addressEev = new CustomEvent(
            'address',
            {
                detail : this.address.Id
            }
        );
        this.dispatchEvent(addressEev);
    }
