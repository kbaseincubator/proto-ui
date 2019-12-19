import React, { Component } from 'react';
import { History } from 'history';

import { LoadingSpinner } from '../generic/LoadingSpinner';
import { fetchAppDetails, AppFullDetails } from '../../utils/fetchApps';


interface Props {
  history: History;
}

interface State {
  appName?: string;
  moduleName?: string;
  loading: boolean;
  details?: AppFullDetails;
}

export class AppDetails extends Component<Props, State> {
  history: History;

  constructor(props: Props) {
    super(props);
    this.history = props.history;
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const path = document.location.pathname.split('/').filter(p => p !== '');
    const moduleName = path[path.length - 2];
    const appName = path[path.length - 1];
    this.setState({moduleName, appName})
    fetchAppDetails(moduleName + '/' + appName)
      .then((resp) => {
        this.setState({
          details: resp
        });
      })
      .finally(() => {
        this.setState({loading: false});
      });
  }

  // Handle a click on the breadcrumbs "Apps" link to go back to the index
  handleClickApps(ev: React.MouseEvent<HTMLElement>) {
    ev.preventDefault();
    const path = this.state.moduleName + '/' + this.state.appName;
    this.history.push('/apps');
  }

  render() {
    if (this.state.loading) {
      return (
        <LoadingSpinner loading={this.state.loading} />
      );
    }
    return (
      <>
      <div>
        {breadcrumbs(this)}
      </div>
      <div className='flex pt4'>
        <div className='pr4 br b--black-20' style={{width: '30%'}}>
          {appIcon(this)}
          {appMetrics(this)}
          {appSideDetails(this)}
        </div>

        <div style={{width: '70%'}}>
          {title(this)}
          {detailedDesc(this)}
          {citations(this)}
        </div>
      </div>
      </>
    );
  }
}

function breadcrumbs (component: AppDetails) {
  // FIXME let's not hardcode this and derive it from config instead
  const appsHref = window._env.urlPrefix + '/catalog/apps';
  return (
    <div className='flex items-center'>
      <span>
        <a className='link blue b pointer dim' href={appsHref} onClick={ev => component.handleClickApps(ev)}>
          Apps
        </a>
      </span>
      {breadcrumbArrow()}
      <span>
        {component.state.moduleName}
      </span>
      {breadcrumbArrow()}
      <span>
        {component.state.appName}
      </span>
    </div>
  );
}

function breadcrumbArrow () {
  return <span className='fa fa-chevron-right ml2 mr2 o-40 f6' style={{position: 'relative', top: '2px'}}></span>
}

// App title section with description and "Run this app" button
function title (component: AppDetails) {
  return (
    <div className="ph4 mb3">
      <h1 className="mb0 p0 mt0">{component.state.details!.name || ''}</h1>
      <p className="mt2 black-60 mb3">
        {component.state.details!.tooltip || ''}
      </p>
      <a className="bg-green white b pv2 mt1 ph3 br3 dib pointer dim mb3 o-60">
        <span className="fa fa-rocket mr1"></span>
        Run this app
      </a>
    </div>
  );
}

// App detailed description section
function detailedDesc (component: AppDetails) {
  return (
    <div className="ph4">
      <p>This is a Narrative Method for running <a href="http://www.usadellab.org/cms/?page=trimmomatic">Trimmomatic: A flexible read trimming tool for Illumina NGS data.</a>
        Trimmomatic is written by <a href="http://www.usadellab.org/cms/index.php?page=BolgerAnthony">Anthony Bolger</a> from the <a href="http://www.usadellab.org">Bjorn Usadel Lab</a>.
      </p>
      <p>
        Trimmomatic version: 0.36: <a href="http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/Trimmomatic-0.36.zip">binary</a>, <a href="http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/Trimmomatic-Src-0.36.zip">source</a>, <a href="http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/TrimmomaticManual_V0.32.pdf">manual</a>.
      </p>

      <h3>Description</h3>
      <p>Trimmomatic performs a variety of useful trimming tasks for Illumina paired-end and single ended data. These tasks are performed as a series of steps. At least one step must be specified, and steps are run in the following order.</p>
      <p>The current steps are:</p>

      <h4>Adapter clipping:</h4> This step will remove Illumina adapters from the reads. You need to select one of the predefined adapter sets and set parameters for match criteria. Suggested adapter sequences are provided for TruSeq2 (as used in GAII machines) and TruSeq3 (as used by HiSeq and MiSeq machines), for both single-end and paired-end mode. You can find more information on the adapters in the <a href="http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/TrimmomaticManual_V0.32.pdf">Trimmomatic manual</a>.
      <ul>
        <li><b>Adapters</b>: Select one of the predefined adapter sets.</li>
        <li><b>Seed mismatches</b>: The maximum number of mismatches that will allow a full match to be performed. To speed up search, short sections of each adapter (upto 16bp) are tested at all possible positions to find "seeds" that trigger a full alignment. This Seed mismatch parameter specifies the allowable mismatches for a seed.</li>
        <li><b>Simple clip threshold</b>: Alignment minimum score threshold for match, suggested values are 7-15. Score equals 0.6 per match minus Q/10 per mismatch.</li>
        <li><b>Palindrome clip threshold</b>: Using the same scoring as above, the pair of reads is aligned. Suggested value around 30.</li>
      </ul>

      <h4>Crop reads:</h4> Removes bases, regardless of their quality, from the end of the read, so that the read has the specified length. Steps performed after Crop might further shorten the read.
      <ul>
        <li><b>Crop length</b>: Number of bp to keep, from the start of the read.</li>
      </ul>

      <h4>Head crop:</h4> Removes the specified number of bases, regardless of quality, from the beginning of the read.
      <ul>
        <li><b>Head crop length</b>: Number of bp to remove from the start of a read.</li>
      </ul>

      <h4>Leading minimum quality:</h4> Remove low quality bases from the beginning, i.e., bases with a value below this threshold.
      <ul>
        <li><b>Leading minimum quality</b>: Minimum quality score.</li>
      </ul>

      <h4>Trailing minimum quality:</h4> Remove low quality bases from the end. As long as a base has a value below this threshold, the base is removed and the next base is investigated. This approach can be used for removing the special Illumina 'low quality segment' regions (which have a quality score of 2), but we recommend Sliding window for that.
      <ul>
        <li><b>Trailing minimum quality</b>: Minimum quality score.</li>
      </ul>

      <h4>Sliding window:</h4> Performs sliding window trimming once the average quality within the window falls below specified threshold. By considering multiple bases, a single poor quality base will not cause the removal of high quality data later in the read.
      <ul>
        <li><b>Sliding window size</b>: length of window in bp.</li>
        <li><b>Sliding window minimum quality</b>: The average quality required.</li>
      </ul>

      <h4>Minimum read length:</h4> This removes reads that fall below the specified minimum length. Reads removed by this step are included in the 'dropped reads' count.
      <ul>
        <li><b>Minimum read length</b>: Length in bp.</li>
      </ul>
    </div>
  );
}

function citations (component: AppDetails) {
  return (
    <div className="mt4 pt2 pr4 bt b--black-20 bg-black-05 pa4">
      <h3>Publications</h3>
      <div className="mb4">
        <p>
          Bolger AM, Lohse M, Usadel B. Trimmomatic: a flexible trimmer for
          Illumina sequence data. Bioinformatics. 2014;30: 2114 2120.
          doi:10.1093/bioinformatics/btu170
          http://www.ncbi.nlm.nih.gov/pubmed/24695404
        </p>

        <p>
          http://www.usadellab.org/cms/?page=trimmomatichttp://www.usadellab.org/cms/?page=trimmomatic
        </p>
      </div>
    </div>
  );
}

function appIcon (component: AppDetails) {
  return (
    <div className="flex justify-center items-center mt2" style={{marginBottom: "3.6rem"}}>
      <div style={{width: "5.5rem", height: "5.5rem"}} className="dib bg-blue br3 mr3 shadow-2"></div>
    </div>
  );
}

function appMetrics (component: AppDetails) {
  return (
    <>
    <div className="flex mb4">
      <div className="w-50">
        <div className="black-60 mb2">Total runs</div>
        <div className="b f4 black-80">10</div>
      </div>
      <div className="w-50">
        <div className="black-60 mb2">Total stars</div>
        <div className="b f4 black-80">20</div>
      </div>
    </div>
    <div className="flex bb b--black-10 mb3 pb3">
      <div className="w-50">
        <div className="black-60 mb2">Success rate</div>
        <div className="b f4 black-80">23.1%</div>
      </div>
      <div className="w-50">
        <div className="black-60 mb2">Average run time</div>
        <div className="b f4 black-80">6m 23s</div>
      </div>
    </div>
    </>
  );
}

// TODO categories
// TODO full description html
// TODO icon
// TODO example uses
// TODO metrics / stats
// TODO github link
// TODO publications
// TODO versions

// Additional sidebar details such as repo link, versions, authors, etc
function appSideDetails (component: AppDetails) {
  // TODO author links
  const authors = component.state.details!.authors || [];
  let authorElems = [];
  // Intersperse commas between authors
  for (let i = 0; i < authors.length; i++) {
    authorElems.push(<a className="pointer blue dim">{authors[i]}</a>);
    if (i < authors.length - 1) {
      authorElems.push(", ");
    }
  }
  return (
    <>
    <div className="bb b--black-10 mb3 pb3">
      <div className="black-60 mb2">Source code</div>

      <div className="b truncate">
        <a className="link blue pointer dim">
          <span className="fas fa-external-link-alt o-60"></span>
          https://github.com/kbaseapps/kb_trimmomatic
        </a>
      </div>
    </div>

    <div className="mb3 pb3 bb b--black-10">
      <div className="black-60 mb2">Authors</div>
      <div>
        {authorElems}
      </div>
    </div>

    <div className="mb3 pb3 bb b--black-10">
      <div className="black-60 mb2">Versions</div>
      <div className="mb1">
        <span className="b black-70">Release:</span> 0.0.1
      </div>
      <div className="mb1">
        <strong className="b black-70">Beta:</strong> 0.2.0
      </div>
      <div className="">
        <strong className="b black-70">Development:</strong> 0.3.1
      </div>
    </div>
    <div>
      <div className="black-60 mb3">Example uses</div>
      <a className="link blue pointer dim db mb3">
        Arabidopsis RNA-seq Analysis Tutorial
      </a>
      <a className="link blue pointer dim db mb3">
        Microbial Metabolic Model Reconstruction and Analysis Tutorial
      </a>
      <a className="link blue pointer dim db mb3">
        Genome Extraction from Shotgun Metagenome Sequence Data
      </a>
    </div>
    </>
  );
}
