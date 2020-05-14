<template>
    <div>
        <InputForm />
        
        <ItineraryResult />
    </div>
</template>

<script>

import InputForm from '../components/main/InputForm';
import ItineraryResult from '../components/main/ItineraryResult';

export default {
    components: {
        InputForm,
        ItineraryResult
    }
}
</script>