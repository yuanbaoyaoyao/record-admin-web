
// import { isExternal } from '@/utils/validate'

// export default {
//     props: {
//         to: {
//             type: String,
//             required: true
//         }
//     },
//     setup(props) {
//         const isExternal = () => {
//             return isExternal(to)
//         },
//         const type = () => {
//             if (this.isExternal) {
//                 return 'a'
//             }
//             return 'router-link'
//         },
//         const linkProps = (to) => {
//             if (this.isExternal) {
//                 return {
//                     href: to,
//                     target: '_blank',
//                     rel: 'noopener'
//                 }
//             }
//             return {
//                 to: to
//             }
//         }
//     }

// }
// </script>

<template>
    <component :is="linkProps(to)">
        <slot />
    </component>
</template>

<script>
import { defineComponent } from "vue"
import { isExternal } from "../../../utils/validate"
export default defineComponent({
    props: {
        to: {
            type: String,
            required: true,
        }
    },
    setup() {
        const linkProps = (url) => {
            if (isExternal(url)) {
                return {
                    is: 'a',
                    href: url,
                    target: '_blank',
                    rel: 'noopener',
                };
            }
            return {
                is: 'router-link',
                to: url,
            };
        };
        return {
            linkProps,
        }
    }
})
</script>

<style>
</style>