import { Component, OnDestroy, NgZone, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.css']
})
export class Page2Component implements OnDestroy, AfterViewInit {
  private chart: any;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      Promise.all([
        import('@amcharts/amcharts4/core'),
        import('@amcharts/amcharts4/charts'),
        import('@amcharts/amcharts4/themes/animated')
      ])
        .then(modules => {
          const am4core = modules[0];
          const am4charts = modules[1];
          const am4themes_animated = modules[2].default;

          am4core.useTheme(am4themes_animated);

          let chart = am4core.create('chartdiv', am4charts.XYChart);

          chart.paddingRight = 20;

          let data = [];
          let visits = 10;
          for (let i = 1; i < 366; i++) {
            visits += Math.round(
              (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10
            );
            data.push({
              date: new Date(2018, 0, i),
              name: 'name' + i,
              value: visits
            });
          }

          chart.data = data;

          let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          dateAxis.renderer.grid.template.location = 0;

          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.tooltip.disabled = true;
          valueAxis.renderer.minWidth = 35;

          let series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.dateX = 'date';
          series.dataFields.valueY = 'value';

          series.tooltipText = '{valueY.value}';
          chart.cursor = new am4charts.XYCursor();

          let scrollbarX = new am4charts.XYChartScrollbar();
          scrollbarX.series.push(series);
          chart.scrollbarX = scrollbarX;

          this.chart = chart;
        })
        .catch(e => {
          console.error('Error when creating chart', e);
        });
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
