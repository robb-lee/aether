'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  templateManager, 
  Template,
  createCustomTheme,
  generateAIHints,
  COLOR_PALETTES,
  FONT_PAIRS 
} from '@aether/templates';

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_PAIRS[0]);
  const [businessDescription, setBusinessDescription] = useState('');
  const [generatedHints, setGeneratedHints] = useState<any>(null);

  useEffect(() => {
    const templateId = params.templateId as string;
    const foundTemplate = templateManager.getTemplateById(templateId);
    if (foundTemplate) {
      setTemplate(foundTemplate);
    }
  }, [params.templateId]);

  const handleGenerateHints = () => {
    if (template && businessDescription.trim()) {
      const hints = generateAIHints(template, businessDescription);
      setGeneratedHints(hints);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">템플릿을 찾을 수 없습니다</h1>
          <button
            onClick={() => router.push('/test/templates')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            템플릿 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const customTheme = createCustomTheme(selectedPalette, selectedFont, {
    borderRadius: 'medium',
    spacing: 'normal'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/test/templates')}
                className="text-blue-600 hover:text-blue-800 text-sm mb-2"
              >
                ← 템플릿 목록으로
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
              <p className="text-gray-600">{template.description}</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                {template.industry}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">템플릿 미리보기</h2>
              
              {/* Mock Website Preview */}
              <div 
                className="border rounded-lg overflow-hidden"
                style={{
                  backgroundColor: customTheme.colors?.background,
                  color: customTheme.colors?.text
                }}
              >
                {template.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => (
                    <div 
                      key={index}
                      className="border-b last:border-b-0 p-6"
                      style={{
                        borderColor: customTheme.colors?.secondary + '20'
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 
                          className="font-semibold"
                          style={{
                            color: customTheme.colors?.primary,
                            fontFamily: customTheme.fonts?.heading
                          }}
                        >
                          {section.componentId}
                        </h3>
                        <div className="flex gap-2">
                          {section.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              필수
                            </span>
                          )}
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            순서: {section.order}
                          </span>
                        </div>
                      </div>
                      
                      <div 
                        className="text-sm mb-2"
                        style={{ fontFamily: customTheme.fonts?.body }}
                      >
                        <strong>Props:</strong> {Object.keys(section.defaultProps).join(', ')}
                      </div>
                      
                      <div className="text-xs text-gray-600">
                        <strong>AI 힌트:</strong> {section.aiHints.contentTone || '기본 톤 사용'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* AI Hints Generator */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">AI 힌트 생성기</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비즈니스 설명
                </label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="예: 팀 협업을 위한 생산성 향상 도구"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <button
                onClick={handleGenerateHints}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                AI 힌트 생성
              </button>

              {generatedHints && (
                <div className="mt-4 bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">생성된 AI 힌트</h3>
                  <div className="text-sm text-green-700">
                    <div className="mb-2"><strong>톤:</strong> {generatedHints.tone}</div>
                    <div className="mb-2"><strong>대상:</strong> {generatedHints.audience}</div>
                    <div className="mb-2">
                      <strong>키워드:</strong> {generatedHints.keyWords.slice(0, 10).join(', ')}
                    </div>
                    <div className="mb-2">
                      <strong>피해야 할 단어:</strong> {generatedHints.avoidWords.join(', ')}
                    </div>
                    <div>
                      <strong>CTA 예시:</strong> {generatedHints.callToActionExamples.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">커스터마이징</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3">색상 팔레트</h3>
                <div className="space-y-2">
                  {COLOR_PALETTES.map((palette) => (
                    <button
                      key={palette.name}
                      onClick={() => setSelectedPalette(palette)}
                      className={`w-full p-3 text-left border rounded-lg ${
                        selectedPalette.name === palette.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{palette.name}</div>
                      <div className="flex gap-1 mt-1">
                        {Object.values(palette.colors).map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">폰트 조합</h3>
                <div className="space-y-2">
                  {FONT_PAIRS.map((fontPair) => (
                    <button
                      key={fontPair.name}
                      onClick={() => setSelectedFont(fontPair)}
                      className={`w-full p-3 text-left border rounded-lg ${
                        selectedFont.name === fontPair.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{fontPair.name}</div>
                      <div className="text-xs text-gray-600">
                        {fontPair.heading} / {fontPair.body}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">템플릿 정보</h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <strong>ID:</strong> {template.id}
                </div>
                <div>
                  <strong>산업:</strong> {template.industry}
                </div>
                <div>
                  <strong>섹션 수:</strong> {template.sections.length}개
                </div>
                <div>
                  <strong>필수 섹션:</strong> {template.sections.filter(s => s.required).length}개
                </div>
                <div>
                  <strong>태그:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}