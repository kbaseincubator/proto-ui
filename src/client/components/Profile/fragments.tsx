import React from 'react';

// Create tootip for Organization Auto Complete
export function institutionToolTip() {
  return (
    <div>
      <p>
        Your primary association - organization, institution, business.
        <br />
        You may enter your own value or chose from the option fileted by your
        entry.
        <br />
        National Labs derived from:{' '}
        <a href="https://science.energy.gov/laboratories/" target="_blank">
          DOE Web Site - Laboratories
        </a>
        <br />
        US higher education institutions derived from:{' '}
        <a
          href="http://carnegieclassifications.iu.edu/index.php"
          target="_blank"
        >
          Carnegie Classification of Institutions of Higher Education{' '}
        </a>
      </p>
    </div>
  );
}

/**
 * populate research interest and handles case that prop is empty
 */
export function buildResearchInterests(
  researchInterests: Array<string>,
  researchInterestsOther: string
) {
  if (Array.isArray(researchInterests)) {
    researchInterests = researchInterests;
    if (researchInterests.includes('Other')) {
      return (
        <ul style={{ textAlign: 'left' }}>
          {researchInterests.map(interest => (
            <li key={interest}>{interest}</li>
          ))}
          <ul>
            <li>{researchInterestsOther}</li>
          </ul>
        </ul>
      );
    } else {
      return (
        <ul style={{ textAlign: 'left' }}>
          {researchInterests.map(interest => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      );
    }
  } else {
    return <div>No Entry</div>;
  }
}
