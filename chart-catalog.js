const chart = (id, name, ko, description, anatomy, rule) => ({
  id, name, ko, group: 'Charts', description, source: ['Chart'], anatomy,
  states: 'Loaded · Loading · Empty · Error · Partial data', rule
});

const chartFamilies = [
  chart('bar-chart', 'Bar chart', '막대 차트', '항목별 크기와 여러 집단의 값을 비교합니다.', 'Title · Axis · Bars · Legend · Tooltip · Data table', '값을 길이로 표현하는 축은 0에서 시작합니다. 긴 항목명은 가로 막대를 사용하고 그룹·누적·음수의 비교 목적을 구분합니다.'),
  chart('line-chart', 'Line chart', '선 차트', '시간과 회차에 따른 수치의 변화를 보여 줍니다.', 'Title · Time axis · Lines · Points · Legend · Tooltip · Data table', '시간 간격과 단위를 명시합니다. 없는 값을 0으로 채우거나 선으로 임의 연결하지 않습니다.'),
  chart('area-chart', 'Area chart', '영역 차트', '시간에 따른 양과 구성의 변화를 함께 보여 줍니다.', 'Title · Axis · Filled areas · Legend · Tooltip · Data table', '채워진 면적의 기준을 0으로 두고 누적 값과 100% 비중을 구분합니다.'),
  chart('pie-chart', 'Pie chart', '파이 차트', '하나의 전체를 구성하는 항목의 비중을 보여 줍니다.', 'Title · Slices · Labels · Legend · Tooltip · Data table', '서로 겹치지 않는 양수 항목으로 전체를 구성합니다. 작은 차이의 비교는 막대 차트를 사용합니다.'),
  chart('donut-chart', 'Donut chart', '도넛 차트', '전체의 구성 비율과 합계를 함께 표시합니다.', 'Title · Segments · Total · Legend · Tooltip · Data table', '중앙 수치는 같은 데이터의 합계를 표시합니다. 필터로 분모가 바뀌면 합계와 비율도 함께 갱신합니다.'),
  chart('radar-chart', 'Radar chart', '레이더 차트', '여러 평가 항목의 강점과 보완점을 비교합니다.', 'Title · Shared scale · Axes · Polygons · Legend · Tooltip · Data table', '모든 축의 방향과 척도를 맞춥니다. 면적을 종합점수로 해석하지 않고 항목별 수치를 함께 제공합니다.'),
  chart('radial-chart', 'Radial chart', '방사형 차트', '목표 대비 달성률을 원형 막대로 표시합니다.', 'Title · Tracks · Arcs · Value · Legend · Tooltip · Data table', '목표와 현재 값을 함께 표시합니다. 반지름이 다른 호의 길이로 항목별 양을 비교하지 않습니다.'),
  chart('scatter-chart', 'Scatter chart', '산점도', '두 수치 사이의 분포와 관계를 살펴봅니다.', 'Title · X axis · Y axis · Points · Legend · Tooltip · Data table', '양쪽 축의 단위를 표시하고 상관관계를 인과관계로 표현하지 않습니다. 개별 사용자 정보는 권한에 따라 보호합니다.'),
  chart('heatmap-chart', 'Heatmap', '히트맵', '날짜나 항목별 수치의 밀도와 반복 패턴을 보여 줍니다.', 'Title · Rows · Columns · Cells · Intensity scale · Tooltip · Data table', '연한 색에서 진한 색으로 같은 수치 단계를 유지합니다. 활동이 없었던 날과 기록이 없는 날을 구분합니다.'),
  chart('chart-tooltip', 'Chart tooltip', '차트 툴팁', '선택한 데이터의 이름·값·단위를 확인합니다.', 'Data point · Marker · Series name · Value · Unit', '마우스 호버·키보드 포커스·터치 선택에서 같은 값을 제공합니다. 정확한 수치를 툴팁에만 숨기지 않습니다.')
];

// Each presentation has its own catalog entry and stable route.
const presentations = [
  ['area-chart','area-chart','basic','Area · Default','영역 · 기본','곡선으로 양의 흐름을 보여 줍니다. 곡선 사이의 위치를 새 관측값으로 해석하지 않습니다.'],
  ['area-chart-linear','area-chart','linear','Area · Linear','영역 · 직선','관측 지점을 직선으로 잇고 기준선까지 채워 양의 변화를 보여 줍니다.'],
  ['area-chart-step','area-chart','step','Area · Step','영역 · 단계','값이 바뀌는 시점까지 이전 값이 유지되는 데이터에 사용합니다.'],
  ['area-chart-stacked','area-chart','stacked','Area · Stacked','영역 · 누적','같은 단위의 값을 누적해 전체 활동량과 각 항목의 기여를 함께 표시합니다.'],
  ['area-chart-normalized','area-chart','percent','Area · 100% Stacked','영역 · 100% 누적','각 시점의 표시한 항목 합계를 100%로 계산합니다. 원본 횟수와 비율의 분모를 함께 제공합니다.'],
  ['area-chart-gradient','area-chart','gradient','Area · Gradient','영역 · 그라데이션','같은 계열의 채움 강도만 조절합니다. 그라데이션 자체에 추가 수치 의미를 부여하지 않습니다.'],
  ['bar-chart','bar-chart','vertical','Bar · Default','막대 · 기본','범주별 값을 같은 두께의 세로 막대로 비교합니다. 값 축은 0에서 시작합니다.'],
  ['bar-chart-horizontal','bar-chart','horizontal','Bar · Horizontal','막대 · 가로','항목명이 길거나 순위를 비교할 때 가로 막대를 사용하고 항목명과 막대 순서를 맞춥니다.'],
  ['bar-chart-multiple','bar-chart','grouped','Bar · Multiple','막대 · 다중','같은 항목의 여러 계열을 나란히 배치합니다. 범례 선택 후에도 축 범위를 유지합니다.'],
  ['bar-chart-stacked','bar-chart','stacked','Bar · Stacked','막대 · 누적','같은 전체를 이루는 항목을 쌓습니다. 전체 크기와 각 조각의 수치를 구분해 제공합니다.'],
  ['bar-chart-labels','bar-chart','labels','Bar · Labels','막대 · 수치 라벨','막대 위에 정확한 수치를 표시합니다. 짧은 막대에서도 단위와 라벨이 잘리지 않게 합니다.'],
  ['bar-chart-negative','bar-chart','negative','Bar · Negative','막대 · 음수','0 기준선 위와 아래에 양수·음수를 표시합니다. 증감의 기준과 단위를 함께 씁니다.'],
  ['line-chart','line-chart','linear','Line · Linear','선 · 직선','실제 관측값을 직선으로 연결합니다. 없는 값은 0으로 바꾸거나 선으로 이어 그리지 않습니다.'],
  ['line-chart-smooth','line-chart','smooth','Line · Smooth','선 · 곡선','관측값 사이의 곡선은 흐름을 읽는 보조 표현입니다. 실제 관측 지점의 수치를 함께 제공합니다.'],
  ['line-chart-step','line-chart','step','Line · Step','선 · 단계','값이 변경되는 순간과 유지되는 구간을 구분할 때 사용합니다.'],
  ['line-chart-dots','line-chart','dots','Line · Dots','선 · 데이터 점','관측 지점을 점으로 강조합니다. 점이 없는 위치를 실제 측정한 값처럼 설명하지 않습니다.'],
  ['line-chart-multiple','line-chart','multiple','Line · Multiple','선 · 다중','여러 계열을 같은 시간축과 척도로 비교하고 이름·점·선 모양으로 구분합니다.'],
  ['pie-chart','pie-chart','basic','Pie · Default','파이 · 기본','같은 전체를 이루는 항목의 비중을 표시합니다. 합계와 분모를 명시합니다.'],
  ['pie-chart-labels','pie-chart','labels','Pie · Labels','파이 · 수치 라벨','조각의 비율을 바깥 라벨로 표시합니다. 작은 조각의 이름과 원본 값은 범례와 표에서도 제공합니다.'],
  ['donut-chart-basic','donut-chart','basic','Donut · Default','도넛 · 기본','중앙에 부가 수치를 넣지 않고 조각의 비중을 보여 줍니다.'],
  ['donut-chart','donut-chart','total','Donut · Total','도넛 · 합계','표시한 항목의 합계를 중앙에 표시하고 전체 합계인지 선택 항목 합계인지 설명합니다.'],
  ['radar-chart','radar-chart','single','Radar · Default','레이더 · 기본','하나의 평가 대상을 동일한 척도의 여러 축으로 표시합니다.'],
  ['radar-chart-multiple','radar-chart','multiple','Radar · Multiple','레이더 · 다중','여러 평가 대상을 같은 축 순서와 척도로 비교합니다. 채움이 겹쳐도 각 선을 구분할 수 있어야 합니다.'],
  ['radial-chart','radial-chart','single','Radial · Single','방사형 · 단일','한 가지 목표의 현재 값·목표·달성률을 표시합니다.'],
  ['radial-chart-multiple','radial-chart','multiple','Radial · Multiple','방사형 · 다중','각 목표의 달성률을 독립된 원호로 표시합니다. 서로 다른 반지름의 호 길이로 크기를 비교하지 않습니다.'],
  ['chart-tooltip-dot','chart-tooltip','multiple','Tooltip · Dot','툴팁 · 점 표식','다중 막대의 같은 항목에 속하는 계열 이름·점 표식·원본 수치·단위를 함께 표시합니다.']
];

export const chartComponents = presentations.map(([id,family,variant,name,ko,note]) => ({
  ...chartFamilies.find(c=>c.id===family), id, name, ko,
  description:note, chartFamily:family, chartVariant:variant, chartNote:note
}));
for (const [id,family,variant,name,ko] of [
  ['contributions','heatmap-chart','activity','Activity Heatmap','활동량 히트맵'],
  ['scatter-chart','scatter-chart','distribution','Scatter chart','산점도']
]) {
  const source=chartFamilies.find(c=>c.id===family);
  chartComponents.push({...source,id,name,ko,group:'Data display',chartFamily:family,chartVariant:variant});
}

export const chartRouteAliases = {'heatmap-chart':'contributions','chart-tooltip':'chart-tooltip-dot'};

export function chartPresentation(id) {
  const component=chartComponents.find(c=>c.id===(chartRouteAliases[id]||id));
  return component ? {family:component.chartFamily,variant:component.chartVariant,component} : null;
}
