import { User, Globe, Server, Calendar, Tag, Hash } from 'lucide-react';
import type { AlertData } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { formatTimestamp } from '@/utils/formatters';
import { PRIORITY_COLORS } from '@/utils/constants';
import { clsx } from 'clsx';

interface AlertInfoCardProps {
  alert: AlertData;
}

interface FieldRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  badge?: string;
  badgeClass?: string;
}

function FieldRow({ icon, label, value, mono, badge, badgeClass }: FieldRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-800/60 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center flex-shrink-0 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-500 mb-0.5">{label}</div>
        <div className="flex items-center gap-2">
          <span className={clsx('text-sm text-slate-200 truncate', mono && 'font-mono')}>{value}</span>
          {badge && (
            <span className={clsx('text-xs px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider flex-shrink-0', badgeClass)}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function AlertInfoCard({ alert }: AlertInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Tag size={14} className="text-cyan-400" />
          Alert Details
        </h3>
      </CardHeader>
      <CardBody className="py-0">
        <FieldRow icon={<Hash size={14} />} label="Issue Key" value={alert.issue_key} mono badge={alert.issue_key} badgeClass="bg-slate-800 border-slate-700 text-slate-400" />
        <FieldRow icon={<Globe size={14} />} label="Indicator" value={alert.indicator} mono />
        <FieldRow icon={<Tag size={14} />} label="Indicator Type" value={alert.indicator_type} />
        <FieldRow icon={<User size={14} />} label="User" value={alert.user_id} mono />
        <FieldRow icon={<Server size={14} />} label="Source IP" value={alert.source_ip} mono />
        <FieldRow
          icon={<Tag size={14} />}
          label="Priority"
          value={alert.priority}
          badge={alert.priority}
          badgeClass={PRIORITY_COLORS[alert.priority] ?? PRIORITY_COLORS['Medium']}
        />
        <FieldRow icon={<Calendar size={14} />} label="Event Time" value={formatTimestamp(alert.event_timestamp)} />
      </CardBody>
    </Card>
  );
}
