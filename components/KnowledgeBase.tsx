
import React from 'react';

// A simple parser to turn the markdown-like text into JSX
const parseKnowledgeBase = (text: string) => {
    const lines = text.split('\n');
    const elements = [];
    let listType: 'ul' | 'ol' | null = null;
    let listItems: React.ReactNode[] = [];

    const endList = () => {
        if (listItems.length > 0) {
            if (listType === 'ul') {
                elements.push(<ul key={elements.length} className="list-disc list-inside space-y-2 mb-4 pl-4 text-gray-300">{listItems}</ul>);
            } else if (listType === 'ol') {
                elements.push(<ol key={elements.length} className="list-decimal list-inside space-y-2 mb-4 pl-4 text-gray-300">{listItems}</ol>);
            }
        }
        listItems = [];
        listType = null;
    };

    for (const line of lines) {
        if (line.startsWith('# ')) {
            endList();
            elements.push(<h1 key={elements.length} className="text-3xl font-bold text-white mt-8 mb-4 pb-2 border-b border-gray-700">{line.substring(2)}</h1>);
        } else if (line.startsWith('## ')) {
            endList();
            elements.push(<h2 key={elements.length} className="text-2xl font-semibold text-red-500 mt-6 mb-3">{line.substring(3)}</h2>);
        } else if (line.startsWith('### ')) {
            endList();
            elements.push(<h3 key={elements.length} className="text-xl font-semibold text-white mt-4 mb-2">{line.substring(4)}</h3>);
        } else if (line.startsWith('- ') || line.startsWith('• ')) {
            if (listType !== 'ul') {
                endList();
                listType = 'ul';
            }
            listItems.push(<li key={listItems.length}>{line.substring(2)}</li>);
        } else if (line.match(/^\d+\.\s/)) {
            if (listType !== 'ol') {
                endList();
                listType = 'ol';
            }
            listItems.push(<li key={listItems.length}>{line.replace(/^\d+\.\s/, '')}</li>);
        } else if (line.trim() === '---') {
            endList();
            elements.push(<hr key={elements.length} className="my-6 border-gray-700" />);
        } else if (line.trim() !== '') {
            endList();
            elements.push(<p key={elements.length} className="mb-4 text-gray-300 leading-relaxed">{line}</p>);
        }
    }
    endList(); // Add any remaining list
    return elements;
};


// Dummy constant, in a real app this would come from constants.ts or an API
const DUMMY_KNOWLEDGE_BASE = `
# GOTEC Production Process and Product Portfolio

This is a browsable version of the GSN's knowledge base. Use this for quick reference or to study the product portfolio.

## Process Flow
1. CORTE E PREPARAÇÃO (ZODEL)
2. FRESAGEM CNC (WEIDA)
3. TORNEAMENTO CNC (DONGS)
4. RETIFICAÇÃO CNC (HDCNC)
5. ELETROEROSÃO (HDCNC/NOVICK)
6. VERIFICAÇÃO / MEDIÇÃO (HAMOO)
7. INJEÇÃO PLÁSTICA (CHEN HSONG)

---

## 1. CORTE E PREPARAÇÃO DE MATERIAL (ZODEL)
### Objective
Preparar barras, blocos e perfis metálicos com precisão, rapidez e segurança.
### Equipamentos
- Serrotes automáticos e semiautomáticos CNC (séries GD / GZK)
- Mesas de rolos e sistemas de alimentação automática
### Argumentos Técnicos
- Precisão de corte ±0,2 mm
- Redução de tempo de preparação até 60 %
- ROI inferior a 10 meses
- Estrutura rígida e longa durabilidade
### Key Selling Point
ZODEL — A base sólida da produção CNC moderna.

---

## 2. FRESAGEM CNC (WEIDA)
### Objective
Transformar o material bruto em geometrias complexas com precisão e repetibilidade, maximizando a produtividade.
### Equipamentos
- Centros de maquinação verticais (GMILL)
- Horizontais (HMC)
- Pórtico e 5 eixos simultâneos (GMC / DMC)
### Argumentos Técnicos
- Estrutura monobloco e fusos refrigerados
- Trocas de ferramenta em <2,5 s
- Capacidade de carga até 8 t
- Compatível com o CAM Estimator
### Key Selling Point
WEIDA — Precisão e produtividade com retorno mensurável. Migração de 3 para 5 eixos.

... and so on for all other products. This component demonstrates how to render the knowledge base.
`;


const KnowledgeBase: React.FC = () => {
    // In a real implementation, you'd import KNOWLEDGE_BASE from constants.ts
    // For brevity in this example, a dummy constant is used.
  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
      <div className="prose prose-invert prose-headings:text-red-500 prose-a:text-red-400">
        {parseKnowledgeBase(DUMMY_KNOWLEDGE_BASE)}
      </div>
    </div>
  );
};

export default KnowledgeBase;
