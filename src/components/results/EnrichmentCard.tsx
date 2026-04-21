import { Database, AlertCircle } from 'lucide-react';
import type { EnrichmentData } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { formatPercentage, formatReputationScore, getReputationColor } from '@/utils/formatters';
import { clsx } from 'clsx';

interface EnrichmentCardProps {
  enrichment: EnrichmentData;
}

const CATEGORY_COLORS: Record<string, string> = {
  phishing: 'bg-red-500/10 text-red-400 border-red-500/20',
  malware: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  spam: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  c2: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  botnet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  ransomware: 'bg-red-600/10 text-red-500 border-red-600/20',
};

export function EnrichmentCard({ enrichment }: EnrichmentCardProps) {
  const {
    malicious_detections,
    suspicious_detections,
    total_detections,
    detection_ratio,
    reputation_score,
    categories,
    threat_names,
    top_vendors,
  } = enrichment;

  const maliciousPct = total_detections > 0 ? (malicious_detections / total_detections) * 100 : 0;
  const suspiciousPct = total_detections > 0 ? (suspicious_detections / total_detections) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Database size={14} className="text-cyan-400" />
          VirusTotal Enrichment
        </h3>
      </CardHeader>
      <CardBody className="space-y-5">
        {/* Detection ratio hero */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-4xl font-bold font-mono text-slate-100">
              {malicious_detections}
              <span className="text-xl text-slate-500">/{total_detections}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">vendors flagged as malicious</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-300">{formatPercentage(detection_ratio)}</div>
            <div className="text-xs text-slate-500">detection rate</div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-red-400">Malicious ({malicious_detections})</span>
              <span className="text-slate-500">{maliciousPct.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-700"
                style={{ width: `${maliciousPct}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-amber-400">Suspicious ({suspicious_detections})</span>
              <span className="text-slate-500">{suspiciousPct.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${suspiciousPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Reputation score */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <span className="text-sm text-slate-400">Reputation Score</span>
          <span className={clsx('text-lg font-bold font-mono', getReputationColor(reputation_score))}>
            {formatReputationScore(reputation_score)}
          </span>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <div className="text-xs text-slate-500 mb-2">Categories</div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className={clsx(
                    'px-2.5 py-1 rounded-full text-xs font-medium border',
                    CATEGORY_COLORS[cat.toLowerCase()] ?? 'bg-slate-800 text-slate-400 border-slate-700',
                  )}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Threat names */}
        {threat_names.length > 0 && (
          <div>
            <div className="text-xs text-slate-500 mb-2">Threat Names</div>
            <div className="space-y-1">
              {threat_names.map((name) => (
                <div key={name} className="flex items-center gap-2 text-sm">
                  <AlertCircle size={12} className="text-red-400 flex-shrink-0" />
                  <span className="font-mono text-slate-300 text-xs">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top vendors table */}
        {top_vendors.length > 0 && (
          <div>
            <div className="text-xs text-slate-500 mb-2">Top Vendor Detections</div>
            <div className="rounded-xl overflow-hidden border border-slate-800">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-800/60">
                    <th className="px-3 py-2 text-left text-slate-500 font-medium">Vendor</th>
                    <th className="px-3 py-2 text-left text-slate-500 font-medium">Result</th>
                    <th className="px-3 py-2 text-left text-slate-500 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {top_vendors.map((v, i) => (
                    <tr
                      key={v.name}
                      className={clsx(
                        'border-t border-slate-800/60 hover:bg-slate-800/30 transition-colors',
                        i % 2 === 0 ? 'bg-transparent' : 'bg-slate-800/20',
                      )}
                    >
                      <td className="px-3 py-2 text-slate-300">{v.name}</td>
                      <td className="px-3 py-2">
                        <span
                          className={clsx(
                            'px-1.5 py-0.5 rounded text-xs font-medium',
                            v.result === 'malicious' && 'bg-red-500/10 text-red-400',
                            v.result === 'suspicious' && 'bg-amber-500/10 text-amber-400',
                            v.result === 'clean' && 'bg-emerald-500/10 text-emerald-400',
                            !['malicious', 'suspicious', 'clean'].includes(v.result) && 'bg-slate-700 text-slate-400',
                          )}
                        >
                          {v.result}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-400">{v.category || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
