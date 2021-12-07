export interface AssertReleaseNotesParams {
  notes: string;
  shouldContain: string[];
  shouldNotContain: string[];
}

export const assertReleaseNotes = ({
  notes,
  shouldNotContain,
  shouldContain,
}: AssertReleaseNotesParams) => {
  shouldNotContain.forEach((shouldNotContain) => {
    expect(notes).not.toContain(shouldNotContain);
  });

  shouldContain.forEach((shouldContain) => {
    expect(notes).toContain(shouldContain);
  });
};
