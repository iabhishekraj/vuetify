import { computed } from 'vue'
import { convertToUnit, defineComponent } from '@/util'

import type { PropType } from 'vue'

export const VDataTableVirtualHeaders = defineComponent({
  name: 'VDataTableVirtualHeaders',

  props: {
    headers: {
      type: Array as PropType<any[][]>,
      required: true,
    },
    rowHeight: {
      type: Number,
      required: true,
    },
    fixed: Boolean,
  },

  setup (props, { slots }) {
    const fixedOffsets = computed(() => {
      return props.headers.flat().reduce((offsets, column) => {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        return [...offsets, offsets[offsets.length - 1] + (column.width ?? 0)]
      }, [0])
    })
    const getFixedStyles = (column: any, y: number, i: number) => {
      if (!props.fixed && !column.fixed) return null

      return {
        position: 'sticky',
        zIndex: column.fixed ? 4 : props.fixed ? 3 : undefined,
        left: column.fixed ? convertToUnit(fixedOffsets.value[i]) : undefined,
        top: props.fixed ? `${props.rowHeight * y}px` : undefined,
      }
    }

    return () => {
      return props.headers.map((row, y) => (
        <tr class="v-data-table-regular__tr" role="row">
          {row.map((column, i) => (
            <th
              class="v-data-table-regular__th"
              style={{
                ...column.style,
                width: convertToUnit(column.width),
                'min-width': convertToUnit(column.width),
                height: convertToUnit(props.rowHeight),
                ...getFixedStyles(column, y, i),
              }}
              role="columnheader"
              colspan={column.colspan}
              rowspan={column.rowspan}
            >
              { column.name }
            </th>
          ))}
        </tr>
      ))
    }
  },
})