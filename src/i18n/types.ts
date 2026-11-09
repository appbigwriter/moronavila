export type Language = 'pt' | 'en' | 'es';

export interface TranslationData {
    langLabel: string;
    flag: string;
    nav: {
        units: string;
        amenities: string;
        location: string;
        vacancies: string;
        comparison: string;
        rules: string;
        scheduleVisit: string;
        residentAccess: string;
        accessPrefix: string;
        whatsapp: string;
    };
    hero: {
        addressBadge: string;
        silenceBadge: string;
        organizedBadge: string;
        noGuarantorBadge: string;
        title: string;
        subtitle: string;
        viewUnitsCta: string;
        mapCta: string;
        stats: {
            downtownTime: string;
            downtownLabel: string;
            uerjTime: string;
            uerjLabel: string;
            metroTime: string;
            metroLabel: string;
            zeroBureaucracy: string;
            zeroBureaucracyLabel: string;
        };
    };
    unitsSection: {
        tag: string;
        titlePrefix: string;
        subtitle: string;
        promoBadge: string;
        promoText: string;
        perMonth: string;
        coupleText: string;
        forPromoMonths: string;
        viewAvailableCta: string;
        reserveRenovatedCta: string;
        upToTwoPeople: string;
    };
    products: Array<{
        id: string;
        name: string;
        audience: string;
        promise: string;
        features: string[];
    }>;
    amenitiesSection: {
        tag: string;
        title: string;
        subtitle: string;
    };
    locationSection: {
        tag: string;
        title: string;
        subtitle: string;
    };
    vacanciesSection: {
        tag: string;
        titlePrefix: string;
        titleHighlight: string;
        subtitle: string;
        noVacanciesTitle: string;
        noVacanciesText: string;
        waitingListCta: string;
        viewDetailsCta: string;
        perMonth: string;
        individual: string;
        shared: string;
        suiteBadge: string;
    };
    comparisonSection: {
        tag: string;
        title: string;
        subtitle: string;
        traditional: {
            title: string;
            type: string;
            rentIptu: string;
            condo: string;
            electricity: string;
            waterGas: string;
            internet: string;
            furniture: string;
            guarantor: string;
            note: string;
        };
        moronavila: {
            title: string;
            subtitle: string;
            furnishedUnit: string;
            noCondoIptu: string;
            electricityWater: string;
            wifi: string;
            kitchen: string;
            cleaning: string;
            intercom: string;
            guarantor: string;
            chooseRoomCta: string;
            meterNote: string;
            included: string;
            noFee: string;
            flexible: string;
        };
    };
    rulesSection: {
        tag: string;
        title: string;
        subtitle: string;
        rulesList: string[];
        cctvNote: string;
        rulesAndRegisterCta: string;
        googleFormsCta: string;
    };
    faqSection: {
        tag: string;
        title: string;
        items: Array<{
            q: string;
            a: string;
        }>;
    };
    contactSection: {
        title: string;
        subtitle: string;
        formNameLabel: string;
        formNamePlaceholder: string;
        formPhoneLabel: string;
        formPhonePlaceholder: string;
        formEmailLabel: string;
        formEmailPlaceholder: string;
        startChatCta: string;
        whatsappConsultantCta: string;
        chatPlaceholder: string;
    };
    roomModal: {
        availability: string;
        capacityLabel: string;
        individual: string;
        shared: string;
        bathroomLabel: string;
        privateSuite: string;
        sharedBathroom: string;
        entryLabel: string;
        entryDetails: string;
        includedLabel: string;
        includedDetails: string;
        descTitle: string;
        defaultDesc: string;
        furnitureTitle: string;
        furnitureDefault: string;
        whatsappCta: string;
        simulateCta: string;
        newBadge: string;
        goodBadge: string;
        fairBadge: string;
    };
    simulatorModal: {
        title: string;
        step1Title: string;
        entryDateLabel: string;
        step2Title: string;
        monthlyRent: string;
        securityDeposit: string;
        cleaningFee: string;
        totalToMoveIn: string;
        agreeCta: string;
        preRegisterTitle: string;
        preRegisterSubtitle: string;
        successTitle: string;
        successText: string;
        backToHome: string;
    };
    footer: {
        desc: string;
        addressTitle: string;
        addressLine1: string;
        addressLine2: string;
        rulesLink: string;
        formsLink: string;
        loginBtn: string;
        dashboardBtn: string;
        rights: string;
    };
}

