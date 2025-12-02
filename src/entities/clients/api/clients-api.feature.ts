import { HttpErrorResponse } from '@angular/common/http';
import { inject } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientsGetCollection200Response, ClientJsonldClientRead, ClientJsonldClientWrite, ClientService } from "@api/index";
import { DefaultOverlayService } from "@lib/services/default-overlay";
import { Helper } from '@lib/helpers/Helper.functions';
import { LanguageService } from '@i18n/language.service';
import { tapResponse } from "@ngrx/operators";
import { patchState, signalStoreFeature, withMethods } from "@ngrx/signals";
import { addEntities, addEntity, setAllEntities, setEntity, updateEntity } from "@ngrx/signals/entities";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import {
    SuccessInformationPopupService
} from '@ui/popups/success-information-popup/success-information-popup.service';
import { langData } from "../lang";
import { catchError, exhaustMap, filter, finalize, map, of, pipe, take, tap, throwError, zip } from "rxjs";
import { ClientFilter } from "./clients.store.filter.class";
import { TClientUpdateData } from "../types/clients.store.types";
import { ClientEntity } from '../model/ClientEntity.model';
import { ClientIdFilter } from './client.store.filter.class';

export function withClientsApi() {
    return signalStoreFeature(
        withMethods( (
            store: any,
            apiService: ClientService = inject( ClientService ),
            // defaultOverlayService: DefaultOverlayService = inject(DefaultOverlayService),
            successInformationPopupService: SuccessInformationPopupService = inject( SuccessInformationPopupService ),
            router: Router = inject( Router ),
            route: ActivatedRoute = inject( ActivatedRoute )
        ) => {
            LanguageService.setLangData( langData[LanguageService.getLangStatic()] );
            let methods = {
                loadByFilter: rxMethod<true | void>(
                    pipe(
                        exhaustMap( ( asSetEntites: true | void ) => {
                            // defaultOverlayService.show();
                            return apiService.apiClientsGetCollection( ...store.filter().getFilter() ).pipe(
                                tapResponse( {
                                    next: ( clients: ApiClientsGetCollection200Response ) => {
                                        let members: ClientEntity[] = clients.member.map( ( client: ClientJsonldClientRead ) => {
                                            if ( client?.totalSold?.amount ) {
                                                client.totalSold.amount = Helper.transformFixedAmount( client.totalSold?.amount );
                                            }
                                            return new ClientEntity( client );
                                        } );

                                        if ( asSetEntites ) {
                                            patchState( store, setAllEntities<ClientEntity>( members ) );

                                        } else {
                                            patchState( store, addEntities<ClientEntity>( members ) );
                                        }
                                        patchState( store, { isLoading: true, totalCount: clients.totalItems } );
                                    },
                                    error: console.error,
                                    finalize: () => {
                                        // defaultOverlayService.hide();
                                    },
                                } )
                            );
                        } )
                    )
                ),
                create: rxMethod<ClientJsonldClientWrite>(
                    pipe(
                        filter( ( client: ClientJsonldClientWrite ) => !!client ),
                        exhaustMap( ( client: ClientJsonldClientWrite ) => {
                            // defaultOverlayService.show();
                            return apiService.apiClientsPost( client ).pipe(
                                tapResponse( {
                                    next: ( client: ClientJsonldClientRead ) => {
                                        methods.loadByFilter();
                                        successInformationPopupService.hide();
                                        successInformationPopupService.show( null, true, 5000 );
                                        // patchState(store, setAllEntities(clients.member, { selectId }));
                                        router.navigate( ['../clients'], { relativeTo: route } );
                                    },
                                    error: ( error: HttpErrorResponse ) => {
                                        successInformationPopupService.hide();
                                        successInformationPopupService.show( error?.error?.violations ?? null, false, 5000 );
                                        console.error( error );
                                    },
                                    // finalize: () => defaultOverlayService.hide(),
                                } ),
                            );
                        } )
                    )
                ),
                deleteByIds: ( ids: string[] ) => {
                    return zip(
                        ids.map( ( id: string ) => apiService.apiClientsIdDelete( id ).pipe( catchError( () => of( null ) ) ) )
                    ).pipe(
                        take( 1 ),
                        tap( () => {
                            // patchState(store, removeEntities(ids));
                            methods.loadByFilter();
                            successInformationPopupService.hide().show( null, true, 800, LanguageService.translate( 'delete_popup.success_popup' ) );
                        } ),
                        map( () => { } )
                    );
                },
                loadById: rxMethod<{ id: string, filter?: ClientIdFilter; }>(
                    pipe(
                        filter( ( client: { id: string, filter?: ClientIdFilter; } ) => !!client.id ),
                        exhaustMap( ( client: { id: string, filter?: ClientIdFilter; } ) => {
                            // defaultOverlayService.show();
                            return apiService.apiClientsIdGet( client.id, ...client.filter?.getFilter() ?? [] ).pipe(
                                tapResponse( {
                                    next: ( client: ClientJsonldClientRead ) => {
                                        if ( client.totalSold?.amount ) {
                                            client.totalSold.amount = Helper.transformFixedAmount( client.totalSold?.amount );
                                        }
                                        patchState( store, setEntity<ClientEntity>( new ClientEntity( client ) ) );
                                    },
                                    error: console.error,
                                    // finalize: () => defaultOverlayService.hide(),
                                } ),
                            );
                        } )
                    )
                ),
                loadByIdAsObservable: ( { id, filter }: { id: string, filter?: ClientIdFilter; } ) => {
                    return apiService.apiClientsIdGet( id, ...filter?.getFilter() ?? [] ).pipe(
                        tapResponse( {
                            next: ( client: ClientJsonldClientRead ) => {
                                if ( client.totalSold?.amount ) {
                                    client.totalSold.amount = Helper.transformFixedAmount( client.totalSold?.amount );
                                }
                                patchState( store, setEntity<ClientEntity>( new ClientEntity( client ) ) );
                            },
                            error: console.error,
                        } ),
                    );
                },
                update: rxMethod<TClientUpdateData>(
                    pipe(
                        // filter((id: string, client: ClientClientWrite) => !!client && !!id),
                        exhaustMap( ( clientData: TClientUpdateData ) => {
                            // defaultOverlayService.show();
                            return apiService.apiClientsIdPatch( clientData.id, clientData.client ).pipe(
                                tapResponse( {
                                    next: ( client: any ) => {
                                        console.log( client );
                                        methods.loadByFilter();
                                        successInformationPopupService.hide();
                                        successInformationPopupService.show( null, true, 5000, LanguageService.translate( 'clients_details_page_front.success_info.success' ) );
                                        patchState( store, updateEntity<ClientEntity>( { id: client.id, changes: client } ) );
                                        // patchState(store, setAllEntities(clients.member, { selectId }));
                                    },
                                    error: ( error: HttpErrorResponse ) => {
                                        successInformationPopupService.hide();
                                        successInformationPopupService.show( error?.error?.violations ?? null, false, 5000, LanguageService.translate( 'clients_details_page_front.success_info.error' ) );
                                        console.error( error );
                                    },
                                    // finalize: () => defaultOverlayService.hide(),
                                } ),
                            );
                        } )
                    )
                ),
                loadByFilterTemporaryData: ( filter: ClientFilter ) => {
                    return apiService.apiClientsGetCollection( ...filter.getFilter() ).pipe(
                        map( ( clients: ApiClientsGetCollection200Response ) => {
                            clients.member.forEach( ( it: ClientJsonldClientRead ) => {
                                if ( it.totalSold?.amount ) {
                                    it.totalSold.amount = Helper.transformFixedAmount( it.totalSold.amount );
                                }
                            } );
                            patchState( store, addEntities<ClientEntity>( clients.member.map( it => new ClientEntity( it ) ) ) );
                            return clients.member;
                        } ),
                        catchError( error => {
                            console.error( error );
                            return throwError( () => error );
                        } ),
                        // finalize(() => defaultOverlayService.hide()),
                    );
                },
                createAsObservable: ( client: ClientJsonldClientWrite ) => {
                    // defaultOverlayService.show();
                    return apiService.apiClientsPost( client ).pipe(
                        map( ( client: ClientJsonldClientRead ) => {
                            patchState( store, addEntity<ClientEntity>( new ClientEntity( client ) ) );
                            return client;
                        } ),
                        catchError( error => {
                            console.error( error );
                            return throwError( () => error );
                        } ),
                        // finalize(() => defaultOverlayService.hide()),
                    );
                }
            };
            return methods;
        } )
    );
};
