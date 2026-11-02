const chart = (id, name, ko, description, anatomy, rule) => ({
  id, name, ko, group: 'Charts', description, source: ['Chart'], anatomy,
  states: 'Loaded · Loading · Empty · Error · Partial data', rule
});

export const chartComponents = [
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

export const chartVariants = {
  'bar-chart': [['vertical', '세로'], ['horizontal', '가로'], ['grouped', '다중'], ['stacked', '누적'], ['labels', '수치 라벨'], ['negative', '음수']],
  'line-chart': [['linear', '직선'], ['smooth', '곡선'], ['step', '계단'], ['dots', '데이터 점'], ['multiple', '다중']],
  'area-chart': [['basic', '기본'], ['linear', '직선'], ['step', '계단'], ['stacked', '누적'], ['percent', '100% 누적'], ['gradient', '그라데이션']],
  'pie-chart': [['basic', '기본'], ['labels', '수치 라벨']],
  'donut-chart': [['total', '합계'], ['basic', '기본']],
  'radar-chart': [['multiple', '비교'], ['single', '단일']],
  'radial-chart': [['multiple', '다중'], ['single', '단일']],
  'scatter-chart': [['distribution', '분포']],
  'heatmap-chart': [['activity', '활동 기록']],
  'chart-tooltip': [['multiple', '점 표식']]
};
