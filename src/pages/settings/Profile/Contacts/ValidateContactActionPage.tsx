import React, {useEffect, useMemo, useRef} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import DotIndicatorMessage from '@components/DotIndicatorMessage';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import useLocalize from '@hooks/useLocalize';
import usePrevious from '@hooks/usePrevious';
import useThemeStyles from '@hooks/useThemeStyles';
import Navigation from '@libs/Navigation/Navigation';
import {ValidateCodeFormHandle} from '@pages/settings/Profile/Contacts/ValidateCodeForm/BaseValidateCodeForm';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import ValidateCodeForm from './ValidateCodeForm';

function ValidateContactActionPage() {
    const [account] = useOnyx(ONYXKEYS.ACCOUNT);
    const themeStyles = useThemeStyles();
    const {translate} = useLocalize();
    const validateCodeFormRef = useRef<ValidateCodeFormHandle>(null);
    const [loginList] = useOnyx(ONYXKEYS.LOGIN_LIST);

    const [pendingContactAction] = useOnyx(ONYXKEYS.PENDING_CONTACT_ACTION);
    const loginData = loginList?.[pendingContactAction?.contactMethod ?? '']

    useEffect(() => {
        if(!loginData || !!loginData.pendingFields?.addedLogin) {
            return;
        }

        // Navigate to methods page on successful magic code verification
        Navigation.navigate(ROUTES.SETTINGS_CONTACT_METHODS.route);
    }, [loginData?.pendingFields, loginList]);

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableMaxHeight
            testID={ValidateContactActionPage.displayName}
        >
            <HeaderWithBackButton
                title={account?.primaryLogin ?? ''}
                onBackButtonPress={() => Navigation.goBack(ROUTES.SETTINGS_CONTACT_METHODS.route)}
            />
            <View style={[themeStyles.ph5, themeStyles.mt3, themeStyles.mb7]}>
                <DotIndicatorMessage
                    type="success"
                    style={[themeStyles.mb3]}
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    messages={{0: translate('contacts.enterMagicCode', {contactMethod: account?.primaryLogin ?? ''})}}
                />
                <ValidateCodeForm
                    isValidatingAction
                    loginList={loginList}
                    ref={validateCodeFormRef}
                    pendingContact={pendingContactAction}
                    contactMethod={account?.primaryLogin ?? ''}
                />
            </View>
        </ScreenWrapper>
    );
}

ValidateContactActionPage.displayName = 'ValidateContactActionPage';

export default ValidateContactActionPage;
