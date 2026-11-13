// These states belong to the inert documentation gallery only.
export function secondaryThumbnail(id, markup, icon) {
  switch (id) {
    case 'upload':
      return markup
        .replace('PDF · 최대 10MB · 이 예제는 파일을 전송하지 않습니다.', 'PDF · 최대 10MB')
        .replace(/<input\b[^>]*type="file"[^>]*>/, input =>
          `<div class="custom-control custom-file">${input.replace('<input', '<input data-custom="true" class="custom-file-input" tabindex="-1"')}<button type="button" class="btn">${icon('Upload')} 파일 선택</button></div>`)
        .replace('선택한 파일이 없습니다.', '포트폴리오.pdf');
    case 'filter-button':
      return markup
        .replace('class="btn " data-ext-filter', 'class="btn dds-applied" data-ext-filter aria-pressed="true"')
        .replace('>경력 전체<', '>경력 3년 이상 · 1<')
        .replace('전체 경력을 표시합니다.', '경력 3년 이상 공고만 표시합니다.');
    case 'toggle':
    case 'toggle-group':
      return markup.replace(
        'class="btn " data-ext-toggle aria-pressed="false"',
        'class="btn selected" data-ext-toggle aria-pressed="true"',
      );
    case 'field':
      return markup
        .replace('data-ext-form novalidate', 'data-ext-form novalidate class="dds-variant-field" data-dds-state="error"')
        .replace('type="email"', 'type="email" value="mina@" aria-invalid="true"')
        .replace(/aria-describedby="[^"]+-hint ([^"]+-error)"/, 'aria-describedby="$1"')
        .replace(/<p id="[^"]+-hint" class="helper">[^<]*<\/p>/, '')
        .replace('data-field-error aria-live="polite"></p>', 'data-field-error aria-live="polite">올바른 이메일 주소를 입력해 주세요.</p>');
    case 'input-otp':
      return markup
        .replace('data-ext-otp aria-describedby', 'data-ext-otp value="1234" aria-describedby')
        .replace('숫자 6자리를 입력해 주세요.', '4 / 6자리 입력');
    case 'input-group':
      return markup.replace('type="password"', 'type="password" value="example"');
    case 'questionnaire':
      return markup
        .replace('data-ext-questionnaire', 'data-ext-questionnaire data-step="1"')
        .replace('1 / 3 질문', '2 / 3 질문')
        .replace('data-question="0"', 'data-question="0" hidden')
        .replace('data-question="1" hidden', 'data-question="1"')
        .replace('data-question-back disabled', 'data-question-back');
    case 'scroll-area':
    case 'message-scroller':
      return markup.replace(
        /(<div class="dds-scroll"[^>]*>[\s\S]*?)(<\/ul><\/div>|<\/article><\/div>(?=<div class="dds-action-area">))/,
        '<div class="dds-gallery-scroll-window">$1$2<span class="dds-gallery-scroll-indicator" aria-hidden="true"></span></div>',
      );
    case 'resizable':
      return markup
        .replace('class="dds-resizable"', 'class="dds-resizable" style="--panel:62%"')
        .replace('aria-valuenow="50"', 'aria-valuenow="62"');
    case 'video':
      return markup
        .replace(/<b>면접 영상 영역<\/b>[\s\S]*?<\/button>/, '<b>면접 영상</b><p>일시정지</p>')
        .replace(/<\/div>$/, `<div class="dds-gallery-media"><button type="button" class="icon-btn" aria-label="재생">${icon('Play')}</button><span>00:48 / 02:34</span><button type="button" class="icon-btn" aria-label="음소거">${icon('VolumeX')}</button></div></div>`);
    case 'icon-button':
      return `<div class="dds-gallery-icon-hint">${markup}<div class="dds-icon-tooltip" role="tooltip">문항 추가</div></div>`;
    default:
      return null;
  }
}
