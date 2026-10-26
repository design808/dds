// Documentation formatting only: the live preview keeps its original markup.
const voidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const rawTags=new Set(['pre','textarea','script','style']);
const escapeAttribute=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const escapeText=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

export function formatHTML(html){
 const template=document.createElement('template');
 template.innerHTML=html;
 const format=(node,depth=0)=>{
  const indent='  '.repeat(depth);
  if(node.nodeType===Node.TEXT_NODE)return node.textContent.trim()?indent+escapeText(node.textContent.trim()):'';
  if(node.nodeType===Node.COMMENT_NODE)return indent+`<!--${node.data}-->`;
  if(node.nodeType!==Node.ELEMENT_NODE)return '';
  const tag=node.localName;
  // Whitespace inside these elements is content, not indentation.
  if(rawTags.has(tag))return indent+node.outerHTML;
  const children=[...node.childNodes];
  const attributes=[...node.attributes].map(({name,value})=>value===''?name:`${name}="${escapeAttribute(value)}"`);
  const svg=node.namespaceURI==='http://www.w3.org/2000/svg';
  const emptySVG=svg&&!children.length;
  const end=emptySVG?' />':'>';
  const start=`<${tag}${attributes.length?' '+attributes.join(' '):''}${end}`;
  const opening=indent+((indent+start).length<=96?start:`<${tag}\n${attributes.map(a=>indent+'  '+a).join('\n')}\n${indent}${end.trimStart()}`);
  if(voidTags.has(tag)||emptySVG)return opening;
  const closing=`</${tag}>`;
  if(!children.length)return opening+closing;
  const hasText=children.some(c=>c.nodeType===Node.TEXT_NODE&&c.textContent.trim());
  const hasElements=children.some(c=>c.nodeType===Node.ELEMENT_NODE);
  // Preserve spaces around emphasis, links, and other text within a sentence.
  // An icon + label is laid out on separate lines to expose the SVG structure.
  if(hasText&&hasElements&&!children.some(c=>c.nodeType===Node.ELEMENT_NODE&&c.localName==='svg'))return opening+node.innerHTML+closing;
  if(!hasElements&&children.every(c=>c.nodeType===Node.TEXT_NODE)){
   const text=escapeText(node.textContent);
   if(!opening.includes('\n')&&!text.includes('\n')&&(opening+text+closing).length<=96)return opening+text+closing;
  }
  return opening+'\n'+children.map(c=>format(c,depth+1)).filter(Boolean).join('\n')+'\n'+indent+closing;
 };
 return [...template.content.childNodes].map(node=>format(node)).filter(Boolean).join('\n');
}
