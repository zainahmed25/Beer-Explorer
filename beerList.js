/* eslint-disable radix */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import searchBeer from '@salesforce/apex/BeerController.searchBeer';
import cartIco from '@salesforce/resourceUrl/cart';
import getCartId from '@salesforce/apex/BeerController.getCartId';
import createCartItems from '@salesforce/apex/BeerController.createCartItems';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class BeerList extends NavigationMixin(LightningElement) {

    @track beerRecords;
    @track errros;
    @track cart = cartIco;
    @track cartId;
    @track itemsinCart = 0;

    connectedCallback(){
        this.defaultCartId();
    } 

    defaultCartId(){
        getCartId()
        .then(data => {
            const wrapper = JSON.parse(data);
            if ( wrapper ){
                this.itemsinCart = wrapper.Count;
                this.cartId = wrapper.CartId;
            }
        })
        .catch(error => {
            this.cartId = undefined;
            console.log(error);
        });
    }

    navigateToCartDetail(){
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Cart_Detail' 
            },
            state : {
                c__cartId : this.cartId
            }
        }, true);
    }

    

    addToCart(event){
        const selectBeerId = event.detail;

        const selectBeerRecord = this.beerRecords.find(
            record => record.Id === selectBeerId
        );
        /*
            for(Beer__c beer : beerRecords ){
                if(beer.Id == selectBeerId ){
                    return beer;
                }
            }
        */
        createCartItems({
            CartId : this.cartId,
            BeerId : selectBeerId,
            Amount : selectBeerRecord.Price__c
        })
        .then(data => {
            console.log(' Cart Item Id ', data);
            this.itemsinCart = this.itemsinCart + 1;
            const toast = new ShowToastEvent({
                'title' : 'Success!!',
                "message" : selectBeerRecord.Name +' Added into Cart!',
                "variant" : "success", 
            });
            this.dispatchEvent(toast);
        })
        .catch(error => {
            console.log(error);
            const toast = new ShowToastEvent({
                'title' : 'Error!!',
                "message" : JSON.stringify(error),
                "variant" : "error", 
            });
            this.dispatchEvent(toast);
        });

    }
    
// This is also my learning
    @wire(searchBeer)
        wiredRecords({error, data}){
            
            if ( data ) {
                this.beerRecords = data;
                this.errors = undefined;
            }
            if( error ) {
                this.beerRecords = undefined;
                this.errors = error;
            }
        }

    handleEvent(event){
        const eventVal = event.detail;
        
        searchBeer({
            searchParam : eventVal
        })
        .then(result => {
            
            this.beerRecords = result;
            this.errros = undefined;
        })
        .catch(error => {
            
            this.errors = error;
            this.beerRecords = undefined;
        })
    }
}