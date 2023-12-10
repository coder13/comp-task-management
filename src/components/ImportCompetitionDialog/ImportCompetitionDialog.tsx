'use client';

import { DialogProps } from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { formatDateShort } from '@/lib/time';
import { Competition } from '@/wcaApi/types';
import { useEffect, useState } from 'react';
import { List, ListItem } from '../List';
import { useImportCompetitionMutation } from '@/generated/queries';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ImportCompetitionDialogProps extends DialogProps {}

export function ImportCompetitionDialog({
  ...props
}: ImportCompetitionDialogProps) {
  const [open, setOpen] = useState(false);
  const [importableCompetitions, setImportableCompetitions] = useState<
    Competition[]
  >([]);

  const [selectedCompetitionId, setSelectedCompetitionId] = useState<
    string | null
  >(null);

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      fetch('/api/wca/upcoming_manageable_competitions')
        .then((res) => res.json())
        .then(({ competitions }) => {
          if (competitions) {
            setImportableCompetitions(competitions || []);
          }
        });
    }
  }, [open]);

  const [
    importCompetition,
    { data: importedCompetition, loading: importingCompetition },
  ] = useImportCompetitionMutation();

  const selectedCompetition = importableCompetitions.find(
    (c) => c.id === selectedCompetitionId,
  );

  const reset = () => {
    setSelectedCompetitionId(null);
    setSelectedTemplateId(null);
  };

  const handleImportCompetition = () => {
    if (!selectedCompetitionId) {
      return;
    }

    importCompetition({
      variables: {
        wcaId: selectedCompetitionId,
      },
    });
  };

  console.log(importedCompetition);

  return (
    <Dialog
      {...props}
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start flex text-center items-baseline space-x-2"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          <i className="bx bx-plus" />
          <span>Import Competition</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Import Competition</DialogTitle>
          <DialogDescription>Choose Competition to import</DialogDescription>
        </DialogHeader>
        {!selectedCompetition ? (
          <List>
            {importableCompetitions.map((competition) => (
              <ListItem
                key={competition.id}
                onClick={() => {
                  setSelectedCompetitionId(competition.id);
                }}
                primary={competition.name}
                secondary={formatDateShort(competition.start_date)}
              />
            ))}
          </List>
        ) : (
          <List>
            <ListItem
              onClick={() => {}}
              primary={selectedCompetition.name}
              secondary={formatDateShort(selectedCompetition.start_date)}
            />
          </List>
        )}
        {selectedCompetition && (
          <>
            <p>Select template to import with</p>
            {selectedTemplateId === null ? (
              <List>
                <ListItem
                  onClick={() => {
                    setSelectedTemplateId(-1);
                  }}
                  primary={'New'}
                />
              </List>
            ) : (
              <List>
                <ListItem
                  onClick={() => {
                    setSelectedTemplateId(null);
                  }}
                  primary={selectedTemplateId === -1 ? 'New' : 'Existing'}
                />
              </List>
            )}
          </>
        )}

        {!importedCompetition && (
          <Button
            variant="outline"
            disabled={selectedTemplateId === null || !selectedCompetition}
            onClick={handleImportCompetition}
          >
            {importingCompetition ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing
              </>
            ) : (
              'Import Competition with selected template'
            )}
          </Button>
        )}
        {importedCompetition && (
          <div>
            <p>Competition imported</p>
            <Link
              href={`/competitions/${importedCompetition.importCompetition.Metadata?.wcaId}`}
              passHref
            >
              <Button variant="outline" className="w-full">
                Go to competition
              </Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
