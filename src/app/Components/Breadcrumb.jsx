import { useEffect } from 'react';
import { useBreadcrumbStore } from './BreadcrumbStore';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const useBreadcrumbSegment = (label, path) => {
  const pushSegment = useBreadcrumbStore((state) => state.pushSegment);
  const popSegment = useBreadcrumbStore((state) => state.popSegment);

  const segment = {
    label,
    path: path ?? window.location.pathname,
  };

  useEffect(() => {
    pushSegment(segment);
    return () => popSegment();
  }, []);
};

const DefaultSeparator = () => <ChevronRight size={14} className="text-slate-400" />;

const BreadcrumbItem = ({ segment, isLast, Separator }) => (
  <div className="flex items-center gap-1">
    {segment.path ? (
      <Link
        to={segment.path}
        className={`text-sm transition-colors ${isLast ? 'text-slate-500' : 'text-blue-500 hover:text-blue-600'}`}
      >
        {segment.label}
      </Link>
    ) : (
      <span className={`text-sm ${isLast ? 'text-slate-500' : 'text-blue-500'}`}>
        {segment.label}
      </span>
    )}
    <Separator />
  </div>
);

export default function Breadcrumb({ separator: Separator = DefaultSeparator }) {
  const segments = useBreadcrumbStore((state) => state.segments);

  if (!segments.length) return null;

  return (
    <nav className="flex items-center gap-1 mb-4">
      {segments.map((segment, index) => (
        <BreadcrumbItem
          key={`${segment.label}-${index}`}
          segment={segment}
          isLast={index === segments.length - 1}
          Separator={Separator}
        />
      ))}
    </nav>
  );
}
