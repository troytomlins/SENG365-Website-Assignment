<template>
  <!-- Modal -->
  <div class="modal fade" id="attendeesPopup" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="attendeePopupTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">

        <!--title-->
        <div class="modal-header">
          <h2 id="attendeePopupTitle" class="">Current attendees:</h2>
        </div>

        <!--modal body-->
        <div class="modal-body form">
          <div>
            <!-- Organizer -->
            <div class="row">
              <div class="col-3">
                Organizer
              </div>
              <img class="col-2" :src="orgImg">
              <div class="col text-start">
                {{ organizerName }}
              </div>

            </div>
            <!-- Attendees -->
            <div class="row" v-for="attendee in attendees" v-bind:key="attendee.id">
              <hr class="my-1">
              <div class="col-3">
                Attendee
              </div>
              <img class="col-2" :src="attendee.img">
              <div class="col text-start" v-if="attendee.status !== 'accepted'">
                {{ attendee.firstName }} {{ attendee.lastName }} ({{ attendee.status }})
              </div>
              <div class="col text-start" v-else>
                {{ attendee.firstName }} {{ attendee.lastName }}
              </div>
              <div class="col-2" v-if="isOrganizer && attendee.status === 'pending'">
                <div class="row">
                  <button class="btn btn-success py-0 px-1 mb-1" @click="changeStatus(attendee.attendeeId, 'accepted')">Approve</button>
                </div>
                <div class="row">
                  <button class="btn btn-danger py-0 px-1" @click="changeStatus(attendee.attendeeId, 'rejected')">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--footer-->
        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {Modal} from "bootstrap";
import Api from "@/Api";
import Cookies from 'js-cookie'
export default {
  name: "Attendees",
  props: {
    attendees: {
      default: []
    },
    isOrganizer: {
      type: Boolean,
      default: false
    },
    organizerName: {
      type: String
    },
    eventId: {
      type: String
    },
    orgImg: {
      type: String
    }
  },
  data() {
    return {
      modal: null
    }
  },
  methods: {
    changeStatus(id, status) {
      const token = Cookies.get('token')
      Api.changeAttendance(id, this.eventId, status, token).then(() => {
        this.$parent.getAttendees()
      })
    }
  },
  mounted() {
    this.modal = new Modal(document.getElementById("attendeesPopup"));
  }
}
</script>

<style scoped>

</style>