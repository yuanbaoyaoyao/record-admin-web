import * as echarts from "echarts/core";
import {
    PieChart,
    BarChart,
    LineChart
} from "echarts/charts";
import { SVGRenderer } from "echarts/renderers";
import {
    GridComponent,
    TitleComponent,
    LegendComponent,
    ToolboxComponent,
    TooltipComponent,
    DataZoomComponent,
    VisualMapComponent
} from "echarts/components";

const {
    use
} = echarts;

use([
    PieChart,
    BarChart,
    LineChart,
    SVGRenderer,
    GridComponent,
    TitleComponent,
    LegendComponent,
    ToolboxComponent,
    TooltipComponent,
    DataZoomComponent,
    VisualMapComponent
]);

export default echarts;