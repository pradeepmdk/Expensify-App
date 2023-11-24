import PropTypes from 'prop-types';
import React from 'react';
import VerifyIdentity from '@pages/ReimbursementAccount/VerifyIdentity/VerifyIdentity';
import PersonalInfo from './PersonalInfo/PersonalInfo';

const propTypes = {
    onBackButtonPress: PropTypes.func.isRequired,
    /** If we should show Onfido flow */
    shouldShowOnfido: PropTypes.bool.isRequired,
};

const RequestorStep = React.forwardRef(({shouldShowOnfido, onBackButtonPress}) => {
    if (shouldShowOnfido) {
        return <VerifyIdentity onBackButtonPress={onBackButtonPress} />;
    }

    return <PersonalInfo onBackButtonPress={onBackButtonPress} />;
});

RequestorStep.propTypes = propTypes;
RequestorStep.displayName = 'RequestorStep';

export default RequestorStep;
