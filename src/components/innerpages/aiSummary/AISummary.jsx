import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpenIcon, DocumentTextIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { formatDuration } from '../../../utils/formatDuration';
import labels from '../../config/lables';
import { setSummary } from '../../../store/slices/aiSummarySlice';
import AISummaryReport from '../../commonFiles/AISummaryReport';
import { generateReport } from '../../../utils/report';
import ShimmerBlock from '../../commonFiles/ShimmerBlock';

const AISummary = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();

  const cachedSummaries = useSelector((state) => state.aiSummary.summaries);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState('english');

  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!videoId) {
      setLoading(false);
      return;
    }
    loadSummary();
  }, [videoId]);

  const loadSummary = async () => {
    // Check Redux cache first
    if (cachedSummaries[videoId]) {
      setData(cachedSummaries[videoId]);
      setLoading(false);
      return;
    }

    fetchSummary();
  };

  const fetchSummary = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const response = await fetch(`/api/ai-summary/${videoId}${forceRefresh ? '?refresh=true' : ''}`);
      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.message || 'Failed to generate summary');
        setData(null);
        return;
      }

      setData(result);
      dispatch(setSummary({ videoId, data: result }));
    } catch (error) {
      console.error(error);
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sanitizeFilename = (str) => {
    return str
      .replace(/[^\w\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // spaces to hyphens
      .slice(0, 60); // limit length
  };

  const handleDownloadPdf = async () => {
    try {
      const safeTitle = sanitizeFilename(data.videoInfo?.title || videoId);

      await generateReport({
        document: <AISummaryReport data={data} language={language} />,
        fileName: `${safeTitle}-${language}-summary.pdf`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!videoId) {
    return (
      <div className="h-full flex items-center justify-center p-10">
        <div className="text-center max-w-md">
          <DocumentTextIcon className="h-16 w-16 text-text/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text mb-2">No Video Selected</h2>
          <p className="text-text/60 mb-6">Open a video first to generate an AI-powered summary, key points, and detailed guide.</p>
          <button onClick={() => navigate('/')} className="px-5 py-2 rounded-lg bg-primary text-white cursor-pointer">
            Browse Videos
          </button>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-10 text-center">
        <p className="text-text/80 mb-4">{errorMsg}</p>
        <button onClick={fetchSummary} className="px-4 py-2 rounded-lg bg-primary text-white cursor-pointer">
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 space-y-6">
          <ShimmerBlock className="aspect-video w-full" />
          <ShimmerBlock className="h-20 w-full" />
          <div className="flex gap-3">
            <ShimmerBlock className="h-10 w-24" />
            <ShimmerBlock className="h-10 w-24" />
            <ShimmerBlock className="h-10 w-24" />
          </div>
          <ShimmerBlock className="h-40 w-full" />
          <ShimmerBlock className="h-40 w-full" />
          <ShimmerBlock className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!data || !data.summary) {
    return <div className="p-10 text-text/80">Failed to load summary</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Video */}
        <div className="aspect-video rounded-xl overflow-hidden shadow-md">
          <iframe src={`https://www.youtube.com/embed/${videoId}`} title="Video Preview" className="w-full h-full" allowFullScreen />
        </div>

        {/* Video Info */}
        <div className="bg-background rounded-xl p-5">
          <h1 className="text-2xl font-bold mb-1 text-text">{data.videoInfo?.title}</h1>{' '}
          <div className="flex items-center gap-3 text-sm text-text/70">
            <span>{data.videoInfo?.channelName}</span>
            {data.videoInfo?.duration && (
              <>
                <span>•</span> <span>{formatDuration(data.videoInfo.duration)}</span>{' '}
              </>
            )}
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Side - Languages */}
          <div className="flex flex-wrap gap-3">
            {['english', 'hindi', 'marathi'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-lg capitalize cursor-pointer transition
          ${language === lang ? 'bg-primary text-white' : 'bg-background text-text hover:bg-background/80'}`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3">
            <button onClick={handleDownloadPdf} className="px-4 py-2 rounded-lg bg-highlight/90 text-white cursor-pointer">
              Download PDF
            </button>

            <button onClick={() => fetchSummary(true)} className="px-4 py-2 rounded-lg bg-accent/90 text-white cursor-pointer">
              Regenerate
            </button>
          </div>
        </div>
        {/* AI Summary */}
        <div className="bg-background rounded-xl p-5 w-full">
          <div className="flex items-center gap-2 mb-4">
            <DocumentTextIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-text">{labels[language].aiSummary}</h2>
          </div>
          <p className="leading-7 text-text/80 whitespace-pre-line break-words">{data.summary?.[language]}</p>
        </div>
        {/* Key Points */}
        <div className="bg-background rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <LightBulbIcon className="h-6 w-6 text-highlight" />
            <h2 className="text-2xl font-bold text-text">{labels[language].keyPoints}</h2>
          </div>

          <ul className="space-y-3">
            {data.keyPoints?.[language]?.map((point, index) => (
              <li key={index} className="flex gap-2 text-text/80">
                <span>•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Detailed Guide */}
        <div className="bg-background rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpenIcon className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-bold text-text">{labels[language].detailedGuide}</h2>
          </div>

          {data.detailedGuide?.[language]?.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-text/90">{section.heading}</h3>

              <ul className="space-y-2">
                {section.content.map((item, index) => (
                  <li key={index} className="flex gap-2 text-text/80">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Important Takeaways */}
        <div className="bg-background rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <LightBulbIcon className="h-6 w-6 text-highlight" />
            <h2 className="text-2xl font-bold text-text">{labels[language].importantTakeaways}</h2>
          </div>

          <ul className="space-y-3">
            {data.importantTakeaways?.[language]?.map((item, index) => (
              <li key={index} className="flex gap-2 text-text/80">
                <span>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AISummary;
