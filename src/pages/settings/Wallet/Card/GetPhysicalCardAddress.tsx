import type {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {withOnyx} from 'react-native-onyx';
import type {OnyxEntry} from 'react-native-onyx';
import AddressForm from '@components/AddressForm';
import useLocalize from '@hooks/useLocalize';
import * as FormActions from '@libs/actions/FormActions';
import type {SettingsNavigatorParamList} from '@navigation/types';
import type {Country} from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type SCREENS from '@src/SCREENS';
import type {GetPhysicalCardForm} from '@src/types/form';
import type {Address} from '@src/types/onyx/PrivatePersonalDetails';
import BaseGetPhysicalCard from './BaseGetPhysicalCard';
import type {RenderContentProps} from './BaseGetPhysicalCard';

type GetPhysicalCardAddressOnyxProps = {
    /** Draft values used by the get physical card form */
    draftValues: OnyxEntry<GetPhysicalCardForm>;
};

type GetPhysicalCardAddressProps = GetPhysicalCardAddressOnyxProps & StackScreenProps<SettingsNavigatorParamList, typeof SCREENS.SETTINGS.WALLET.CARD_GET_PHYSICAL.ADDRESS>;

function GetPhysicalCardAddress({
    draftValues,
    route: {
        params: {country: countryFromUrl, domain},
    },
}: GetPhysicalCardAddressProps) {
    const {translate} = useLocalize();

    // Check if country is valid
    const {addressLine1, addressLine2} = draftValues ?? {};
    const [currentCountry, setCurrentCountry] = useState(draftValues?.country);
    const [state, setState] = useState(draftValues?.state);
    const [city, setCity] = useState(draftValues?.city);
    const [zipPostCode, setZipPostCode] = useState(draftValues?.zipPostCode);

    useEffect(() => {
        if (!draftValues) {
            return;
        }
        setState(draftValues.state);
        setCurrentCountry(draftValues.country);
        setCity(draftValues.city);
        setZipPostCode(draftValues.zipPostCode);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [draftValues?.state, draftValues?.country, draftValues?.city, draftValues?.zipPostCode]);

    useEffect(() => {
        if (!countryFromUrl) {
            return;
        }
        FormActions.setDraftValues(ONYXKEYS.FORMS.GET_PHYSICAL_CARD_FORM, {country: countryFromUrl});
    }, [countryFromUrl]);

    const handleAddressChange = useCallback((value: unknown, key: unknown) => {
        const addressPart = value as string;
        const addressPartKey = key as keyof Address;

        if (addressPartKey !== 'country' && addressPartKey !== 'state' && addressPartKey !== 'city' && addressPartKey !== 'zipPostCode') {
            return;
        }
        if (addressPartKey === 'country') {
            setCurrentCountry(addressPart as Country | '');
            setState('');
            setCity('');
            setZipPostCode('');
            return;
        }
        if (addressPartKey === 'state') {
            setState(addressPart);
            setCity('');
            setZipPostCode('');
            return;
        }
        if (addressPartKey === 'city') {
            setCity(addressPart);
            setZipPostCode('');
            return;
        }
        setZipPostCode(addressPart);
    }, []);

    const renderContent = useCallback(
        ({onSubmit, submitButtonText}: RenderContentProps) => (
            <AddressForm
                formID={ONYXKEYS.FORMS.GET_PHYSICAL_CARD_FORM}
                onSubmit={onSubmit}
                onAddressChanged={handleAddressChange}
                submitButtonText={submitButtonText}
                city={city}
                country={currentCountry}
                shouldSaveDraft
                state={state}
                street1={addressLine1}
                street2={addressLine2}
                zip={zipPostCode}
            />
        ),
        [addressLine1, addressLine2, city, currentCountry, handleAddressChange, state, zipPostCode],
    );

    return (
        <BaseGetPhysicalCard
            currentRoute={ROUTES.SETTINGS_WALLET_CARD_GET_PHYSICAL_ADDRESS.getRoute(domain)}
            domain={domain}
            headline={translate('getPhysicalCard.addressMessage')}
            renderContent={renderContent}
            submitButtonText={translate('getPhysicalCard.next')}
            title={translate('getPhysicalCard.header')}
        />
    );
}

GetPhysicalCardAddress.displayName = 'GetPhysicalCardAddress';

export default withOnyx<GetPhysicalCardAddressProps, GetPhysicalCardAddressOnyxProps>({
    draftValues: {
        key: ONYXKEYS.FORMS.GET_PHYSICAL_CARD_FORM_DRAFT,
    },
})(GetPhysicalCardAddress);
