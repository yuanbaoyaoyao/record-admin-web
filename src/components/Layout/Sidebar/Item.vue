
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    name: 'MenuItem',
    props: {
        icon: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        }
    },
    setup() {
        alert("item")
    },
})
</script>
